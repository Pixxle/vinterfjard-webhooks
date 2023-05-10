import { Injectable } from "@nestjs/common";
import { TelegramMessage } from "src/utils/types/telegram_message";
import axios from "axios";
import { JSDOM } from "jsdom";

type ResponseError = {
  error: "RESPONSE_ERROR";
  message: string;
  statusCode: number;
};

const isResponseError = (response: any) => {
  return response.error === "RESPONSE_ERROR";
};

const parseBody = async (body: string) => {
  const parser = new JSDOM(body);
  const progresses = parser.window.document.getElementsByClassName(
    "wpsm_progress-pro-bar"
  );
  for (let i = 0; i < progresses.length; i++) {
    const title = progresses[i].getElementsByClassName("wpsm_progress-title")[0]
      .textContent;
    if (title.includes("Twelve Months")) {
      return `Upcoming Dresden book: ${title}`;
    }
  }
  return "Unable to find progress";
};

@Injectable()
export class DresdenService {
  public async telegram_prompt(telegram_message: TelegramMessage) {
    const options = {
      method: "GET",
      url: "https://www.jim-butcher.com",
    };

    let result = await axios
      .request(options)
      .then(async function ({ data }: { data: string }) {
        return data;
      })
      .catch(function (error: any) {
        return {
          message: `Error: ${error}`,
          error: "RESPONSE_ERROR",
          statusCode: 500,
        } as ResponseError;
      });

    if (isResponseError(result)) {
      result = result as ResponseError;
      return result.message;
    }

    return await parseBody(result as string);
  }
}
