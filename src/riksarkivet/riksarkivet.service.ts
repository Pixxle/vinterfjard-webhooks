import { Injectable } from '@nestjs/common';
import { Telegram } from '../repository/telegram';

@Injectable()
export class RiksarkivetService {
    private telegram: Telegram;

    constructor() {
        if (process.env.TELEGRAM_API_KEY === undefined) {
            throw new Error('TELEGRAM_API_KEY is undefined');
        }
        if (process.env.TELEGRAM_CHAT_ID === undefined) {
            throw new Error('TELEGRAM_CHAT_ID is undefined');
        }
        this.telegram = new Telegram(process.env.TELEGRAM_API_KEY, process.env.TELEGRAM_CHAT_ID);
    }

    checkIfBookable() {
        return 'This action returns all riksarkivet';
    }
}
