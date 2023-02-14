export class Telegram {

    constructor(private apiKey: string, private chatId: string) {
        if (apiKey === undefined) {
            throw new Error('TELEGRAM_API_KEY is undefined');
        }
        if (chatId === undefined) {
            throw new Error('TELEGRAM_CHAT_ID is undefined');
        }
        this.apiKey = apiKey;
        this.chatId = chatId;
    }
}
