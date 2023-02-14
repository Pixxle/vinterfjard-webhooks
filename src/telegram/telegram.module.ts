import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { Telegram } from './telegram';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [TelegramController],
    providers: [TelegramService, Telegram],
})
export class TelegramModule { }
