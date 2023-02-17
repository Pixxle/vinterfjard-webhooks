import { Injectable } from '@nestjs/common';
import { Telegram } from '../repository/telegram';
import { ChatGPT } from '../repository/chatgpt';
import type { TelegramMessage } from '../utils/types/telegram_message';

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

    async handle_prompt(incoming_message: TelegramMessage) {
        const response = await this.chatgpt.handle_prompt(incoming_message.message.text);

        if (response instanceof Error) {
            this.telegram.send_message('CHATGPT_ERROR: ' + response);
            console.error(response);
            return;
        }

        this.telegram.send_message(`🤖: ${response}`);
    };
}
