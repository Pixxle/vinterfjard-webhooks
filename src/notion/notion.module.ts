import { Module } from '@nestjs/common';
import { NotionService } from './notion.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot()],
    providers: [NotionService]
})
export class NotionModule {}
