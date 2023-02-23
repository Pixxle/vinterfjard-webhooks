import { Telegraf } from 'telegraf';

export class Telegram {
    private apiKey: string;
    private debug: boolean;
    private bot: Telegraf;

    constructor(apiKey: string, debug: boolean = false) {
        if (apiKey === undefined) {
            throw new Error('TELEGRAM_API_KEY is undefined');
        }
        this.apiKey = apiKey;
        this.debug = debug;
        this.bot = new Telegraf(this.apiKey);
    }

    public async send_message(message: string, chatid: string): Promise<void> {
        await this.bot.telegram.sendMessage(chatid, message)
        .catch((error) => {
            console.error(error);
            this.bot.telegram.sendMessage(chatid, 'TELEGRAM_BOT_ERROR: ' + error);
        })
        .then((res) => {
            if (!this.debug) return;
            console.log(`TELEGRAM_BOT_RESPONSE: ${res}`);
            this.bot.telegram.sendMessage(chatid, `DEBUG_TELEGRAM_BOT_RESPONSE: ${res}`);
        })
    }
}
