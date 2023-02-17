import { Telegraf } from 'telegraf';

export class Telegram {
    private chatId: string;
    private apiKey: string;
    private debug: boolean;
    private bot: Telegraf;

    constructor(apiKey: string, chatId: string, debug: boolean = false) {
        if (apiKey === undefined) {
            throw new Error('TELEGRAM_API_KEY is undefined');
        }
        if (chatId === undefined) {
            throw new Error('TELEGRAM_CHAT_ID is undefined');
        }
        this.apiKey = apiKey;
        this.chatId = chatId;
        this.debug = debug;
        this.bot = new Telegraf(this.apiKey);
    }

    public async send_message(message: string): Promise<void> {
        await this.bot.telegram.sendMessage(this.chatId, message)
        .catch((error) => {
            console.error(error);
            this.bot.telegram.sendMessage(this.chatId, 'TELEGRAM_BOT_ERROR: ' + error);
        })
        .then((res) => {
            if (!this.debug) return;
            console.log(`TELEGRAM_BOT_RESPONSE: ${res}`);
            this.bot.telegram.sendMessage(this.chatId, `DEBUG_TELEGRAM_BOT_RESPONSE: ${res}`);
        })
    }
}
