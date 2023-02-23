import { Controller, Post, Body} from '@nestjs/common';
import { ChatgptService } from '../chatgpt/chatgpt.service';
import { TelegramMessage } from '../utils/types/telegram_message';
import { Telegram } from '../repository/telegram';
import { NotionService } from 'src/notion/notion.service';

/* This is ugly as sin, but don't _really_ consider this sensitive information  */
const AUTHENTICATIED_USERS = [
    'dennisvinterfjard',
    'Silvervarg',
]

/* TELEGRAM WEBHOOK CONTROLLER */
@Controller('telegram')
export class TelegramController {
    private telegram: Telegram;
    constructor(
        private chatGPTService: ChatgptService,
        private notionService: NotionService
        ) { 
        if (process.env.TELEGRAM_API_KEY === undefined) {
            throw new Error('TELEGRAM_API_KEY is undefined');
        }
        this.telegram = new Telegram(process.env.TELEGRAM_API_KEY);
    }

    private async send_help_message(chatid: string) {
        await this.telegram.send_message('Available commands: !chatgpt', chatid);
    }

    @Post()
    async webhook(@Body() incoming_message: TelegramMessage) {
        if (!incoming_message.message) {
            return;
        };

        if (!AUTHENTICATIED_USERS.includes(incoming_message.message.from.username)) {
            await this.telegram.send_message('You are not authorized to use this bot.', incoming_message.message.chat.id);
            return;
        }

        if (incoming_message.message.text.startsWith('chatgpt')) {
            await this.chatGPTService.telegram_prompt(incoming_message);
            return;
        }

        if (incoming_message.message.text.startsWith('notion add')) {
            await this.notionService.async_add_to_database(incoming_message);
            return;
        }

        if (incoming_message.message.text.startsWith('notion list')) {
            const result = await this.notionService.list_database();
            const header = 'Notion database listing:\n';
            this.telegram.send_message(header+result, incoming_message.message.chat.id);
            return;
        }

        if (incoming_message.message.text.startsWith('help')) {
            await this.telegram.send_message('Available commands: chatgpt', incoming_message.message.chat.id);
            return;
        }

        await this.telegram.send_message('Unknown command received. Type help for a list of available commands.', incoming_message.message.chat.id);
        return;
    }
}
