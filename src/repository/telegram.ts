import TelegramBot from 'node-telegram-bot-api';
export class Telegram {
    private chatId: string;
    private apiKey: string;
    private debug: boolean;
    private bot: TelegramBot;

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
        this.bot = new TelegramBot(this.apiKey)
    }

    public async sendMessage(message: string): Promise<void> {
        await this.bot.sendMessage(this.chatId, message)
        .catch((error) => {
            this.bot.sendMessage(this.chatId, 'TELEGRAM_BOT_ERROR: ' + error);
            console.error(error);
        })
        .then((res) => {
            if (!this.debug) return;
            console.log('TELEGRAM_BOT_RESPONSE: ' + res);
            this.bot.sendMessage(this.chatId, 'DEBUG_TELEGRAM_BOT_RESPONSE: ' + res);
        })
    }
}
