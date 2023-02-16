import { Controller, Get, Req } from '@nestjs/common';
import { RiksarkivetService } from './riksarkivet.service';

@Controller('riksarkivet')
export class RiksarkivetController {
    constructor(private riksarkivetService: RiksarkivetService) { }

    @Get()
    checkIfBookable(@Req() request: Request) {
        return this.riksarkivetService.checkIfBookable();
    }
}
