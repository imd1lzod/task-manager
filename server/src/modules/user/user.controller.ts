import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    async create(@Body() payload: CreateUserDto) {
        return await this.userService.create(payload)
    }

    @Get()
    async getAll() {
        return await this.userService.getAllUsers()
    }

    @Get(":id")
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.getOneUser(id)
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
        return await this.userService.update(id, body)
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.userService.delete(id)
    }
}