import { Module } from '@nestjs/common';
import { RiksarkivetModule } from './riksarkivet/riksarkivet.module';
import { TelegramModule } from './telegram/telegram.module';

@Module({
  imports: [RiksarkivetModule, TelegramModule],
})
export class AppModule { }
