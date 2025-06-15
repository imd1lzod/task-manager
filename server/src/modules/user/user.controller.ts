import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { AuthGuard } from "../auth/guards/check-auth-guard";
import { RolesGuard } from "../auth/guards/check-roles-guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "./enums/role.enum";
import { Protected } from "../auth/decorators/protected.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes } from "@nestjs/swagger";
import { FileTypeValidationPipe } from "src/pipes/check-file-mimetype";
import { FileSizeValidationPipe } from "src/pipes/check-file-size.pipe";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @UseGuards(AuthGuard, RolesGuard)
    @Protected(true)
    @Roles([Role.USER])
    @Post()
    async create(@Body() payload: CreateUserDto) {
        return await this.userService.create(payload)
    }


    @UseGuards(AuthGuard, RolesGuard)
    @Protected(true)
    @Roles([Role.ADMIN])
    @Get()
    async getAll() {
        return await this.userService.getAllUsers()
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Protected(true)
    @Roles([Role.ADMIN, Role.USER])
    @Get(":id")
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.getOneUser(id)
    }

    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    @UseGuards(AuthGuard, RolesGuard)
    @Protected(true)
    @Roles([Role.ADMIN, Role.USER])
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto, @UploadedFile(new FileTypeValidationPipe, new FileSizeValidationPipe) image: Express.Multer.File) {
        return await this.userService.update(id, body, image)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Protected(true)
    @Roles([Role.ADMIN])
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.delete(id)
    }

    @Protected(true)
    @UseGuards(AuthGuard, RolesGuard)
    @Roles([Role.ADMIN, Role.USER])
    @Get('me')
    async me(@Req() req: Request & { id?: number; role?: string }) {
        console.log("salom");

        return await this.userService.getMe(req)
    }
}