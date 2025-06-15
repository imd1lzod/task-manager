import { BadRequestException, Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.client";
import { CreateUserDto } from "./dtos/create-user.dto";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { Role } from "./enums/role.enum";
import * as bcrypt from "bcryptjs"
import { FsWrite } from "src/helpers/fs/fs.helper";

@Injectable()
export class UserService implements OnModuleInit {
    constructor(private prisma: PrismaService, private fs: FsWrite) { }

    async onModuleInit() {
        await this.createDefaultAdmin()
    }

    async create(payload: CreateUserDto) {

        const u = await this.checkExistingUser(payload.email)

        const user = await this.prisma.user.create({ data: payload })
        return {
            message: 'Foydalanuvchi muvaffaqiyatli yaratildi',
            data: user
        }
    }

    async getAllUsers() {
        const users = await this.prisma.user.findMany({ include: { Task: true } })

        return {
            message: "Foydalanuvchilar muvaffaqiyatli olindi",
            data: users
        }
    }

    async update(id: number, payload: UpdateUserDto, image: Express.Multer.File) {
        await this.checkNotExistingUser(id)
        const user = await this.prisma.user.findUnique({where: {id}})
        
        if(user?.imageUrl) {
            await this.fs.removefile(user.imageUrl)
        }


        const data = await this.fs.uploadFile(image)

        const hashedPassword = bcrypt.hashSync(payload.password)

        const updatedUser = await this.prisma.user.update({ data: {name: payload.name, password: hashedPassword, imageUrl: data.fileUrl}, where: { id } })

        return {
            message: 'Foydalanuvchi muvaffaqiyatli yangilandi',
            data: updatedUser
        }
    }

    async getOneUser(id: number) {
        await this.checkNotExistingUser(id)
        const user = await this.prisma.user.findUnique({ where: { id }, include: { Task: true } })

        return {
            message: 'Foydalanuvchi muvaffaqiyatli olindi',
            data: user
        }
    }

    async delete(id: number) {
        await this.checkNotExistingUser(id)
        const user = await this.prisma.user.findUnique({ where: { id } })

        if (!user) {
            return {
                message: 'Bunday idda foydalanuvchi mavjud emas!\nQaytadan urinib ko`ring.',
            }
        }

        await this.prisma.user.delete({ where: { id } })

        return {
            message: 'Foydalanuvchi muvaffaqiyatli tozalandi'
        }
    }

    async checkExistingUser(email: string) {
        const user = await this.prisma.user.findUnique({ where: { email } })

        if (user) {
            throw new BadRequestException(
                'Bunday emaildagi foydalanuvchi allaqachon mavjud! | Boshqa emaildan urinib ko`ring'
            )
        }
    }

    async checkNotExistingUser(id: number) {
        const user = await this.prisma.user.findUnique({ where: { id } })

        if (!user) {
            throw new BadRequestException(
                'Bunday emaildagi foydalanuvchi mavjud emas!\nBoshqa emaildan urinib ko`ring'
            )
        }
    }

    async createDefaultAdmin() {
        const admin = {
            name: "Jasur",
            email: 'jasur@gmail.com',
            password: '1234',
            role: Role.ADMIN
        }
        const hashedPassword = bcrypt.hashSync(admin.password)


        const a = await this.prisma.user.findUnique({ where: { email: admin.email } })

        if (!a) {
            await this.prisma.user.create({ data: { name: admin.name, email: admin.email, password: hashedPassword, role: admin.role } })
        }

        console.log('Default admin yaratildi!');

    }

    async getMe(req: Request & { id?: number; role?: string }) {
        console.log(req);

        const user = await this.prisma.user.findUnique({ where: { id: req.id } })

        if (!user) {
            throw new NotFoundException('Foydalanuvchi topilmadi!')
        }

        return user
    }
}