import { Injectable } from '@nestjs/common';
import { Telegram } from '../telegram/telegram';

@Injectable()
export class RiksarkivetService {
    checkIfBookable() {
        return 'This action returns all riksarkivet';
    }
}
