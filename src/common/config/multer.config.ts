import * as fs from 'fs';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';

export function createMulterConfig(uploadPath: string) {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return {
    storage: diskStorage({
      destination: uploadPath,
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return callback(
          new BadRequestException('Only PNG, JPG and JPEG formats are allowed'),
          false
        );
      }
      callback(null, true);
    },
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
  };
}
