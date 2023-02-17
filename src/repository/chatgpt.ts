export class ChatGPT {
    private apiKey: string;
    private debug: boolean;

    constructor(apiKey: string, debug: boolean = false) {
        if (apiKey === undefined) {
            throw new Error('TELEGRAM_API_KEY is undefined');
        }
        this.apiKey = apiKey;
        this.debug = debug;
    }
}
