import { Injectable } from '@nestjs/common';
import { Notion } from '../repository/notion';
import type { NotionEntry } from '../utils/types/notion_entry';
import { TelegramMessage } from 'src/utils/types/telegram_message';
import { NotionPage } from 'src/utils/types/notion_page';
import { NOTION_ADD_COMMAND } from 'src/utils/commands';

@Injectable()
export class NotionService {
    private notion: Notion;
    constructor() {
        if (process.env.NOTION_KEY === undefined) {
            throw new Error('NOTION_KEY is undefined');
        }
        if (process.env.NOTION_DATABASE === undefined) {
            throw new Error('NOTION_DATABASE is undefined');
        }
        this.notion = new Notion(process.env.NOTION_KEY, process.env.NOTION_DATABASE);
    }

    private convert_telegram_message_to_notion_entries(telegram_message: TelegramMessage) {
        if (!telegram_message.message) {
            throw new Error('Telegram message does not contain a message');
        }

        const filtered = telegram_message.message.text.split('\n').filter((line) => !line.startsWith(NOTION_ADD_COMMAND));

        const res: NotionEntry[] = [];

        filtered.forEach((line) => {
            if (line.startsWith('notion')) return;
            const [name, link] = line.split(' ');
            res.push({ Name: name, Link: link });
        });

        return res;
    }

    private convert_notion_page_to_string(notion_page: NotionPage[]) {
        let res = '';

        for (const page of notion_page) {
            const name = page.properties.Name.title[0].text.content;
            const link = page.properties.Link.url
            const status = page.properties.Status.status.name;
            res += `${name} ${link ? link : ''} ${status} \n`
        }

        return res;
    }

    public async async_add_to_database(telegram_message: TelegramMessage) {
        const entries = this.convert_telegram_message_to_notion_entries(telegram_message);
        if (entries.length === 0) {
            return 'No entries to add';
        }
        await this.notion.add_to_database(entries);
        return 'Added to database'
    }

    public async list_database() {
        const database_pages = await this.notion.list_database();
        return this.convert_notion_page_to_string(database_pages);
    }
}
