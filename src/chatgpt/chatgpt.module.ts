import { Module } from "@nestjs/common";
import { ChatgptService } from "./chatgpt.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ChatgptService],
})
export class ChatgptModule {}
