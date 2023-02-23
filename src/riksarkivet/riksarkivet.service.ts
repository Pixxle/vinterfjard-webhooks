import { Injectable } from '@nestjs/common';
import { Telegram } from '../repository/telegram';
import * as crypto from "crypto";
import axios from 'axios';

@Injectable()
export class RiksarkivetService {
    private telegram: Telegram;
    private debug: boolean;
    private chatid: string;
    constructor() {
        if (process.env.TELEGRAM_API_KEY === undefined) {
            throw new Error('TELEGRAM_API_KEY is undefined');
        }
        if (process.env.TELEGRAM_CHAT_ID === undefined) {
            throw new Error('TELEGRAM_CHAT_ID is undefined');
        }
        this.debug = process.env?.RIKSARKIVET_DEBUG === 'true' ? true : false;
        this.telegram = new Telegram(process.env.TELEGRAM_API_KEY, this.debug);
        this.chatid = process.env.TELEGRAM_CHAT_ID; 
    }

    private generate_hash() {
        const TODAYS_DATE: string = new Date().toISOString().split("T")[0];
        const MD5 = (contents: string) => crypto.createHash("md5").digest("hex");
        return MD5(TODAYS_DATE);
    }

    private async register_hash(hash: string) {
        const registration = await axios.get(
            `https://app.waiteraid.com/reservation/?amount=&app_type=bokabord&custom_request=&date=&from_url=bokabord&hash=${hash}&is_bokabord_web=Y&mealid=&time=`,
            {
              headers: {
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0",
                "Referer": "https://www.bokabord.se/",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Encoding":"gzip, deflate, br",
                "Accept-Language": "en-US,en;q=0.5",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "iframe",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "cross-site",
              }
            }
        );
        
        if (registration.status !== 200) {
            throw new Error(`ERROR_MESSAGE: ${registration.status} ${registration.statusText} ${registration.data}`);
        }
        if (registration["success"] === undefined || registration["success"] === false) {
            throw new Error(`Registration failed, got response ${registration.data}`);
        }

        return true;
    }

    private async get_times(hash: string) {
        const times_request = await axios.post(
            "https://app.waiteraid.com/booking-widget/api/getTimes",
            {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0",
                Accept: "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.5",
                "Content-Type": "application/json;charset=utf-8",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "same-origin",
              },
              referrer: `https://app.waiteraid.com/reservation/?app_type=bokabord&hash=${hash}`,
              body: '{"testmode":0,"date_code":"","date":"2023-12-24","amount":2,"mealid":"27658","mc_code":"","hd_meal":"","hash":"59109446d7cb665b3539e83f12fe96ca","int_test":"N","lang":"","M0x3bXlFNE5PUEh1R2ZpWCtNWG5tQT09":"anFGdWFNWDlKQjVNb080SQ"}',
              method: "POST",
            }
          );
        if (times_request.status !== 200) {
            throw new Error(`ERROR_MESSAGE: ${times_request.status} ${times_request.statusText}`);
        };
        console.log(times_request.data)
        if (times_request.data.times === undefined) {
            throw new Error(`Times is undefined, got response ${times_request.data}`);
        };
        return times_request.data.times.length > 0;
    }

    async notify_if_bookable() {
        const hash = this.generate_hash();

        const registered = await this.register_hash(hash)
        .catch((err) => {
            this.telegram.send_message(`RIKSARKIVET: Failed to register hash, ${err}`, this.chatid);
            return new Error(`Failed to register hash, ${err}`);
        });

        if (typeof registered !== 'boolean' || registered === true) return;
        
        const times_available = await this.get_times(hash)
        .catch((err) => {
            this.telegram.send_message(`RIKSARKIVET: Failed to get times, ${err}`, this.chatid);
            return new Error(`Failed to get times ${err}`);
        });

        if (typeof times_available === 'boolean' && times_available === true) {
            this.telegram.send_message(`RIKSARKIVET: Times available`, this.chatid);
        };
    }
}
