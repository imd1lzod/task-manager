import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.client";

@Module({
    providers: [PrismaService]
})

export class PrismaModule {}