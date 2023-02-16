import { Controller, Get, Req, Response } from '@nestjs/common';
import { RiksarkivetService } from './riksarkivet.service';
import { Request } from 'express';

@Controller('riksarkivet')
export class RiksarkivetController {
    constructor(private riksarkivetService: RiksarkivetService) { }

    @Get()
    async notify_if_bookable(@Req() request: Request) {
        await this.riksarkivetService.notify_if_bookable()
        .catch((error) => {
            console.error(error);
        });
        return;
    }
}
