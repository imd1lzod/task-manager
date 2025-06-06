import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.client";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }

    async create(payload: CreateUserDto) {

        await this.checkExistingUser(payload.email)

        const user = await this.prisma.user.create({data: payload })
        return {
            message: 'Foydalanuvchi muvaffaqiyatli yaratildi',
            data: user
        }
    }

    async getAllUsers() {
        const users = await this.prisma.user.findMany()

        return {
            message: "Foydalanuvchilar muvaffaqiyatli olindi",
            data: users
        }
    }

    async update(id: number, payload: UpdateUserDto) {
        await this.checkNotExistingUser(id)
        const updatedUser = await this.prisma.user.update({data: payload, where: {id}})

        return {
            message: 'Foydalanuvchi muvaffaqiyatli yangilandi',
            data: updatedUser
        }
    }

    async getOneUser(id: number) {
        await this.checkNotExistingUser(id)
        const user = await this.prisma.user.findUnique({where: {id}})

        return {
            message: 'Foydalanuvchi muvaffaqiyatli olindi',
            data: user
        }
    }

    async delete(id: number) {
        await this.checkNotExistingUser(id)
        const user = await this.prisma.user.findUnique({where: {id}})

        if (!user) {
            return {
                message: 'Bunday idda foydalanuvchi mavjud emas!\nQaytadan urinib ko`ring.',
            }
        }

        await this.prisma.user.delete({where: {id}})

        return {
            message: 'Foydalanuvchi muvaffaqiyatli tozalandi'
        }
    }

    async checkExistingUser(email: string) {
        const user = await this.prisma.user.findUnique({where: {email}})

        if (user) {
            return {
                message: 'Bunday emaildagi foydalanuvchi allaqachon mavjud!\nBoshqa emaildan urinib ko`ring'
            }
        }
    }

    async checkNotExistingUser(id: number) {
        const user = await this.prisma.user.findUnique({ where: { id } })

        if (!user) {
            return {
                message: 'Bunday emaildagi foydalanuvchi mavjud emas!\nBoshqa emaildan urinib ko`ring'
            }
        }
    }
}