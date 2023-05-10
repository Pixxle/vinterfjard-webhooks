import { Controller, Post, Body } from "@nestjs/common";
import { ChatgptService } from "../chatgpt/chatgpt.service";
import { TelegramMessage } from "../utils/types/telegram_message";
import { Telegram } from "../repository/telegram";
import { NotionService } from "src/notion/notion.service";
import {
  HELP_COMMAND,
  CHATGPT_COMMAND,
  NOTION_COMMAND,
} from "../utils/constants/commands";

/* This is ugly as sin, but don't _really_ consider this sensitive information  */
const AUTHENTICATIED_USERS = {
  dennisvinterfjard: [CHATGPT_COMMAND, NOTION_COMMAND],

  Silvervarg: [NOTION_COMMAND],
};

type command_service_handler = {
  [CHATGPT_COMMAND]: Function;
  [NOTION_COMMAND]: Function;
};

/* TELEGRAM WEBHOOK CONTROLLER */
@Controller("telegram")
export class TelegramController {
  private telegram: Telegram;
  private command_service: command_service_handler;
  constructor(
    private chatGPTService: ChatgptService,
    private notionService: NotionService
  ) {
    if (process.env.TELEGRAM_API_KEY === undefined) {
      throw new Error("TELEGRAM_API_KEY is undefined");
    }
    this.telegram = new Telegram(process.env.TELEGRAM_API_KEY);
    this.register_commands();
  }

  private register_commands() {
    this.command_service = {
      [CHATGPT_COMMAND]: this.chatGPTService.telegram_prompt.bind(
        this.chatGPTService
      ),
      [NOTION_COMMAND]: this.notionService.telegram_prompt.bind(
        this.notionService
      ),
    };
  }

  private async help_message(incoming_message: TelegramMessage) {
    const username = incoming_message.message.from.username;
    if (username in AUTHENTICATIED_USERS === false) {
      return "You are not authorized to use this bot.";
    }
    return `Available commands: ${AUTHENTICATIED_USERS[username]}`;
  }

  private auth(username: string, command: string) {
    if (username in AUTHENTICATIED_USERS === false) {
      return false;
    }
    if (AUTHENTICATIED_USERS[username].includes(command) === false) {
      return false;
    }
    return true;
  }

  @Post()
  async webhook(@Body() incoming_message: TelegramMessage) {
    if (!incoming_message.message) {
      return;
    }

    if (
      incoming_message.message.from.username in AUTHENTICATIED_USERS ===
      false
    ) {
      await this.telegram.send_message(
        "You are not authorized to use this bot.",
        incoming_message.message.chat.id
      );
      return;
    }

    const user_command = incoming_message.message.text
      .split("\n")[0]
      .split(" ")[0];

    if (user_command === HELP_COMMAND) {
      await this.telegram.send_message(
        await this.help_message(incoming_message),
        incoming_message.message.chat.id
      );
      return;
    }

    if (user_command in this.command_service === false) {
      await this.telegram.send_message(
        "Unknown command received. Type help for a list of available commands.",
        incoming_message.message.chat.id
      );
      return;
    }

    if (!this.auth(incoming_message.message.from.username, user_command)) {
      await this.telegram.send_message(
        await this.help_message(incoming_message),
        incoming_message.message.chat.id
      );
      return;
    }

    const res: string = await this.command_service[user_command](
      incoming_message
    );
    if (!res) return;

    await this.telegram.send_message(res, incoming_message.message.chat.id);
    return;
  }
}
