import { Controller, Post, Body} from '@nestjs/common';
import { ChatgptService } from '../chatgpt/chatgpt.service';
import { TelegramMessage } from '../utils/types/telegram_message';
import { Telegram } from '../repository/telegram';

/* TELEGRAM WEBHOOK CONTROLLER */
@Controller('telegram')
export class TelegramController {
    private telegram: Telegram;
    private chatId: number;
    constructor(private chatGPTService: ChatgptService) { 
        if (process.env.TELEGRAM_API_KEY === undefined) {
            throw new Error('TELEGRAM_API_KEY is undefined');
        }
        if (process.env.TELEGRAM_CHAT_ID === undefined) {
            throw new Error('TELEGRAM_CHAT_ID is undefined');
        }
        this.telegram = new Telegram(process.env.TELEGRAM_API_KEY, process.env.TELEGRAM_CHAT_ID);
        this.chatId = parseInt(process.env.TELEGRAM_CHAT_ID);
    }

    private async send_help_message() {
        await this.telegram.send_message('Available commands: !chatgpt');
    }

    @Post()
    async webhook(@Body() incoming_message: TelegramMessage) {

        if (this.chatId !== incoming_message.message.chat.id) {
            await this.telegram.send_message('Unknown chat id received.');
            await this.telegram.send_message('Expected chat id: ' + this.chatId);
            await this.telegram.send_message('Received chat id: ' + incoming_message.message.chat.id);
            throw new Error('UNEXPECTED CHAT ID RECEIVED');
        };

        if (!incoming_message.message.text.startsWith('!')) {
            return;
        };

        if (incoming_message.message.text.startsWith('!chatgpt')) {
            await this.chatGPTService.telegram_prompt(incoming_message);
            return;
        }

        if (incoming_message.message.text.startsWith('!help')) {
            await this.telegram.send_message('Available commands: !chatgpt');
            return;
        }

        await this.telegram.send_message('Unknown command received. Type !help for a list of available commands.');
        return;
    }
}
