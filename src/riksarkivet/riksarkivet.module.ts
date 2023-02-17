import { Module } from '@nestjs/common';
import { RiksarkivetController } from './riksarkivet.controller';
import { RiksarkivetService } from './riksarkivet.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot()],
    controllers: [RiksarkivetController],
    providers: [RiksarkivetService]
})
export class RiksarkivetModule { }
