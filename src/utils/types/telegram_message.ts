export type TelegramMessage = {
  update_id: string;
  message?: {
    message_id: string;
    from: {
      id: string;
      is_bot: boolean;
      first_name: string;
      last_name: string;
      username: string;
      language_code: string;
    };
    chat: {
      id: string;
      title: string;
      type: string;
      all_members_are_administrators: boolean;
    };
    date: number;
    text: string;
  };
  inline_query?: {
    id: string;
    from: {
      id: string;
      is_bot: boolean;
      first_name: string;
      last_name: string;
      username: string;
      language_code: string;
    };
    query: string;
    offset: string;
    chat_type: string;
  };
};
