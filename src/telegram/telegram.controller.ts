import { Controller, Post, Body} from '@nestjs/common';
import { ChatgptService } from '../chatgpt/chatgpt.service';
import { TelegramMessage } from 'src/utils/types/telegram_message';
import { Telegram } from 'src/repository/telegram';

/* TELEGRAM WEBHOOK CONTROLLER */
@Controller('telegram')
export class TelegramController {
    private telegram: Telegram;
    constructor(private chatGPTService: ChatgptService) { 
        if (process.env.TELEGRAM_API_KEY === undefined) {
            throw new Error('TELEGRAM_API_KEY is undefined');
        }
        if (process.env.TELEGRAM_CHAT_ID === undefined) {
            throw new Error('TELEGRAM_CHAT_ID is undefined');
        }
        this.telegram = new Telegram(process.env.TELEGRAM_API_KEY, process.env.TELEGRAM_CHAT_ID);
    }

    private send_help_message() {
        this.telegram.send_message('Available commands: !chatgpt');
    }

    @Post()
    webhook(@Body() incoming_message: TelegramMessage) {

        if (!incoming_message.message.text.startsWith('!')) {
            return;
        };

        if (incoming_message.message.text.startsWith('!chatgpt')) {
            this.chatGPTService.handle_prompt(incoming_message);
            return;
        }

        if (incoming_message.message.text.startsWith('!help')) {
            this.telegram.send_message('Available commands: !chatgpt');
            return;
        }

        this.telegram.send_message('Unknown command received. Type !help for a list of available commands.');
    }
}
