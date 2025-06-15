import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { TaskService } from "./task.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Role } from "../user/enums/role.enum";
import { RolesGuard } from "../auth/guards/check-roles-guard";
import { AuthGuard } from "../auth/guards/check-auth-guard";
import { Protected } from "../auth/decorators/protected.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { ApiQuery } from "@nestjs/swagger";

@Controller('tasks')
export class TaskController {
    constructor(private taskService: TaskService) { }

    @UseGuards(AuthGuard, RolesGuard)
    @Protected(true)
    @Roles([Role.ADMIN, Role.USER])
    @Post()
    async create(@Body() payload: CreateTaskDto) {
        return await this.taskService.create(payload)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Protected(true)
    @Roles([Role.ADMIN, Role.USER])
    @ApiQuery({name: 'status', required: false})
    @ApiQuery({ name: 'search', required: false })
    @Get()
    async getAll(
        @Query('status') status?: string,
        @Query('search') search?: string
    ) {
        return this.taskService.getAll(status, search);
    }


    @UseGuards(AuthGuard, RolesGuard)
    @Protected(true)
    @Roles([Role.ADMIN, Role.USER])
    @Get(':id')
    async getOne(@Param('id', ParseIntPipe) id: number) {
        return await this.taskService.getOneTask(id)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Protected(true)
    @Roles([Role.ADMIN, Role.USER])
    @Put(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: UpdateTaskDto) {
        return await this.taskService.updateTask(id, payload)
    }

    @UseGuards(AuthGuard, RolesGuard)
    @Protected(true)
    @Roles([Role.ADMIN, Role.USER])
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        return await this.taskService.delete(id)
    }
}