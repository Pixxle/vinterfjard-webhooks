import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { ChatgptService } from '../chatgpt/chatgpt.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [TelegramController],
    providers: [ChatgptService],
})
export class TelegramModule { }
