export type TelegramMessage = {
    update_id: number;
    message: {
        message_id: number;
        from: {
            id: number;
            is_bot: boolean;
            first_name: string;
            last_name: string;
            username: string;
            language_code: string;
        },
        chat: {
            id: number;
            title: string;
            type: string;
            all_members_are_administrators: boolean;
        },
        date: number;
        text: string;
    }
};