import { Client } from "@notionhq/client";
import { NotionEntry } from "src/utils/types/notion_entry";
import { NotionPage } from "src/utils/types/notion_page";

export class Notion {
  private debug: boolean;
  private databaseId: string;
  private notion: Client;

  constructor(apiKey: string, databaseId: string, debug: boolean = false) {
    if (apiKey === undefined) {
      throw new Error("TELEGRAM_API_KEY is undefined");
    }
    if (databaseId === undefined) {
      throw new Error("NOTION_DATABASE is undefined");
    }
    this.notion = new Client({ auth: apiKey });
    this.databaseId = databaseId;
    this.debug = debug;
  }

  public async add_to_database(entries: NotionEntry[]) {
    for (const entry of entries) {
      const response = await this.notion.pages.create({
        parent: { database_id: this.databaseId },
        properties: {
          Name: {
            type: "title",
            title: [{ type: "text", text: { content: entry.Name } }],
          },
          Link: entry.Link
            ? {
                type: "url",
                url: entry.Link,
              }
            : undefined,
        },
      });
    }
  }

  public async list_database() {
    const db_query = await this.notion.databases.query({
      database_id: this.databaseId,
    });

    const res: NotionPage[] = [];

    for (const page of db_query.results) {
      const page_query = (await this.notion.pages.retrieve({
        page_id: page.id,
      })) as NotionPage;
      res.push(page_query);
    }

    return res;
  }
}
