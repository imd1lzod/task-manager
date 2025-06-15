import { ArgumentMetadata, ConflictException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        // console.log(value);
        const mimeTypes = [
            'jpg',
            'jpeg',
            'png',
            'gif',
            'bmp',
            'webp',   
            'tiff',    
            'svg',     
            'ico',     
            'heic',    
            'avif'     
        ];


        if (!mimeTypes.includes(value.mimetype.split("/")[1])) {
            throw new ConflictException('Fayl formati xato berilgan')
        }

        return value
    }
}