import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.client";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthGuard } from "../auth/guards/check-auth-guard";
import { RolesGuard } from "../auth/guards/check-roles-guard";
import { JwtModule } from "@nestjs/jwt";
import { FsWrite } from "src/helpers/fs/fs.helper";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: '1h'
            }
        })
    ],
    controllers: [UserController],
    providers: [UserService, PrismaService, AuthGuard, RolesGuard, FsWrite]
})
export class UserModule { }