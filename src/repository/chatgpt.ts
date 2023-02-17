import { Configuration, OpenAIApi } from 'openai';

export class ChatGPT {
    private apiKey: string;
    private debug: boolean;
    private openai: OpenAIApi;


    constructor(apiKey: string, debug: boolean = false) {
        if (apiKey === undefined) {
            throw new Error('TELEGRAM_API_KEY is undefined');
        }
        this.apiKey = apiKey;
        this.debug = debug;
        const configuration = new Configuration({
            apiKey: this.apiKey,
        });
        this.openai = new OpenAIApi(configuration);
    }

    public async handle_prompt(prompt: string): Promise<string|Error> {
        /* Ensure we have a prompt stopper in the text */
        const prompt_setup = `
        The following text is a incoming message from a user. 
        Please respond as usefully as possible but in a friendly manner. 
        The response should not start with any other character than a space: 
        `
        prompt = prompt_setup + prompt + '####';
        const response = await this.openai.createCompletion({
            model: 'text-davinci-003',
            prompt: prompt,
            n: 1,
            stream: false,
            stop: ['####'],
            max_tokens: 64,
        })
        .then((res) => {
            if (!res) return '';
            return res.data.choices[0].text.slice(2);
        })
        .catch((error: Error) => {
            return error;
        });
        return response
    }
}
