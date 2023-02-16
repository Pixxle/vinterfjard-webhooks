import { Module } from '@nestjs/common';
import { RiksarkivetController } from './riksarkivet.controller';
import { RiksarkivetService } from './riksarkivet.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [ConfigModule.forRoot(), HttpModule],
    controllers: [RiksarkivetController],
    providers: [RiksarkivetService]
})
export class RiksarkivetModule { }
