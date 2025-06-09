import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Role } from "../user/enums/role.enum";

@Controller('tasks')
export class TaskController {
    constructor (private taskService: TaskService) {}

    @Post()
    async create(@Body() payload: CreateTaskDto) {
        return await this.taskService.create(payload)
    }

    @Get()
    async getAll() {
        return await this.taskService.getAll()
    }

    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return await this.taskService.getOneTask(id)
    }

    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateTaskDto) {
        return await this.taskService.updateTask(id, payload)
    }

    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.taskService.delete(id)
    }
}