import { Injectable } from '@nestjs/common';
import { Telegram } from '../repository/telegram';
import { ChatGPT } from '../repository/chatgpt';
import type { TelegramMessage } from '../utils/types/telegram_message';

@Injectable()
export class ChatgptService {
    private chatgpt: ChatGPT;

    constructor() {
        if (process.env.OPENAI_API_KEY === undefined) {
            throw new Error('OPENAI_API_KEY is undefined');
        }
        this.chatgpt = new ChatGPT(process.env.OPENAI_API_KEY, false);
    }

    async telegram_prompt(incoming_message: TelegramMessage) {
         /* Ensure we have a prompt stopper in the text */
        const prompt_setup = `
        The following text is a incoming message from a user. 
        Please respond as usefully as possible but in a friendly manner,
        try your best to answer any question the user might have but also make sure to append additional useful information to the response.
        The response should not start with any other character than a space: \n
        `
        const response = await this.chatgpt.handle_prompt(prompt_setup + incoming_message.message.text);

        if (response instanceof Error) {
            console.error(response);
            return `🤖: An error occured while trying to generate a response.`
        }
        return `🤖: ${response}`
    };
}
