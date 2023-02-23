import { Module } from '@nestjs/common';
import { TelegramModule } from './telegram/telegram.module';
import { ChatgptService } from './chatgpt/chatgpt.service';
import { ChatgptModule } from './chatgpt/chatgpt.module';
import { NotionService } from './notion/notion.service';
import { NotionModule } from './notion/notion.module';

@Module({
  imports: [TelegramModule, ChatgptModule, NotionModule],
  providers: [ChatgptService, NotionService],
})
export class AppModule { }
