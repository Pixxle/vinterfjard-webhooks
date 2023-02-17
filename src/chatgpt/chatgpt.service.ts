import { Injectable } from '@nestjs/common';
import { Telegram } from 'src/repository/telegram';
import { ChatGPT } from 'src/repository/chatgpt';
import type { TelegramMessage } from 'src/utils/types/telegram_message';

@Injectable()
export class ChatgptService {
    private telegram: Telegram;
    private chatgpt: ChatGPT;

    constructor() {
        if (process.env.TELEGRAM_API_KEY === undefined) {
            throw new Error('TELEGRAM_API_KEY is undefined');
        }
        if (process.env.TELEGRAM_CHAT_ID === undefined) {
            throw new Error('TELEGRAM_CHAT_ID is undefined');
        }
        if (process.env.OPENAI_API_KEY === undefined) {
            throw new Error('OPENAI_API_KEY is undefined');
        }
        this.telegram = new Telegram(process.env.TELEGRAM_API_KEY, process.env.TELEGRAM_CHAT_ID);
        this.chatgpt = new ChatGPT(process.env.OPENAI_API_KEY, true);
    }

    handle_prompt(incoming_message: TelegramMessage) {
        this.telegram.send_message('Hello world!');
    };
}
