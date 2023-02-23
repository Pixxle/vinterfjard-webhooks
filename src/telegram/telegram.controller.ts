import { Controller, Post, Body} from '@nestjs/common';
import { ChatgptService } from '../chatgpt/chatgpt.service';
import { TelegramMessage } from '../utils/types/telegram_message';
import { Telegram } from '../repository/telegram';
import { NotionService } from 'src/notion/notion.service';
import * as cmd from '../utils/commands';

/* This is ugly as sin, but don't _really_ consider this sensitive information  */
const AUTHENTICATIED_USERS = {
    'dennisvinterfjard': [
        cmd.CHATGPT_COMMAND, cmd.NOTION_COMMAND
    ],

    'Silvervarg': [
        cmd.NOTION_COMMAND
    ]
}


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

    private async send_help_message(chatid: string, username: string) {
        if (username in AUTHENTICATIED_USERS === false) {
            await this.telegram.send_message('You are not authorized to use this bot.', chatid);
            return;
        }

        await this.telegram.send_message(`Available commands: ${AUTHENTICATIED_USERS[username]}`, chatid);
    }

    @Post()
    async webhook(@Body() incoming_message: TelegramMessage) {
        if (!incoming_message.message) {
            return;
        };

        if (incoming_message.message.from.username in AUTHENTICATIED_USERS === false) {
            await this.telegram.send_message('You are not authorized to use this bot.', incoming_message.message.chat.id);
            return;
        }

        /* ChatGPT handler */
        if (incoming_message.message.text.startsWith(cmd.CHATGPT_COMMAND) && 
                AUTHENTICATIED_USERS[incoming_message.message.from.username].includes(cmd.CHATGPT_COMMAND)) {
            await this.chatGPTService.telegram_prompt(incoming_message);
            return;
        }

        /* Notion handler */
        if (incoming_message.message.text.startsWith(cmd.NOTION_COMMAND) && 
                AUTHENTICATIED_USERS[incoming_message.message.from.username].includes(cmd.NOTION_COMMAND)) {
            if (incoming_message.message.text.startsWith(cmd.NOTION_ADD_COMMAND)) {
                const result = await this.notionService.async_add_to_database(incoming_message);
                this.telegram.send_message(result, incoming_message.message.chat.id);
                return;
            }
            if (incoming_message.message.text.startsWith(cmd.NOTION_LIST_COMMAND)) {
                const result = await this.notionService.list_database();
                const header = 'Notion database listing:\n';
                this.telegram.send_message(header+result, incoming_message.message.chat.id);
                return;
            }
            
            await this.telegram.send_message('Avaiable Notion commands: add, list', incoming_message.message.chat.id);
            return;
        }

        if (incoming_message.message.text.startsWith('/help')) {
            await this.send_help_message(incoming_message.message.chat.id, incoming_message.message.from.username);
            return;
        }

        await this.telegram.send_message('Unknown command received. Type help for a list of available commands.', incoming_message.message.chat.id);
        return;
    }
}
