import { Injectable } from '@nestjs/common';

@Injectable()
export class Telegram {
    log() {
        console.log(process.env.TELEGRAM_TOKEN);
    };
}
