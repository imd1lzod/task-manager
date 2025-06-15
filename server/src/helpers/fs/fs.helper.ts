import { Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "node:fs" 

@Injectable()
export class FsWrite {
    async uploadFile(file: Express.Multer.File) {
        // console.log(file);
        
        const fileFolder = path.join(process.cwd(), "uploads")


        if (!fs.existsSync(fileFolder)) {
            fs.mkdirSync(fileFolder)
        }


        const fileName = `${Date.now()}-file.${file.originalname.split(".")[1]}`
        fs.writeFileSync(path.join(fileFolder, fileName), file.buffer)

        return {
            message: "Faylga muvaffaqiyatli yozildi",
            fileUrl: fileName
        }
    }

    async removefile(fileName: string) {
        const fileFolder = path.join(process.cwd(), "uploads")

        if (fs.existsSync(path.join(fileFolder, fileName))) {
            fs.unlinkSync(path.join(fileFolder, fileName))
        }

        return {
            message: 'Fayl muvaffaqiyatli o`chirildi'
        }
    }
}