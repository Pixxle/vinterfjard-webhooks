import { Module } from '@nestjs/common';
import { RiksarkivetModule } from './riksarkivet/riksarkivet.module';
import { TelegramModule } from './telegram/telegram.module';
import { ChatgptService } from './chatgpt/chatgpt.service';
import { ChatgptModule } from './chatgpt/chatgpt.module';

@Module({
  imports: [RiksarkivetModule, TelegramModule, ChatgptModule],
  providers: [ChatgptService],
})
export class AppModule { }
