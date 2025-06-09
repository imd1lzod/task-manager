import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.client";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@Injectable()
export class TaskService {
    constructor(private prisma: PrismaService) { }

    async create(payload: CreateTaskDto) {
        console.log(payload);

        const task = await this.prisma.task.create({
            data: {
                title: payload.title, description: payload.description,
                status: payload.status,
                deadline: payload.deadline, 
                userId: payload.userId
            }
        })

        return {
            message: 'Task muvaffaqiyatli yaratildi!',
            data: task
        }
    }

    async getAll() {
        const tasks = await this.prisma.task.findMany()

        return {
            data: tasks
        }
    }

    async getOneTask(id: number) {
        const task = await this.prisma.task.findUnique({ where: { id: id } })

        if (!task) {
            throw new NotFoundException('Bunday task topilmadi!')
        }

        return {
            data: task
        }
    }

    async updateTask(id: number, payload: UpdateTaskDto) {
        const task = await this.prisma.task.findUnique({ where: { id: id } })

        if (!task) {
            throw new NotFoundException('Bunday task topilmadi!')
        }

        const newTask = await this.prisma.task.update({ data: payload, where: { id } },)

        return {
            message: 'Task yangilandi1',
            data: newTask
        }
    }

    async delete(id: number) {
        await this.prisma.task.delete({ where: { id } })

        return {
            message: 'Task tozalandi'
        }
    }
}