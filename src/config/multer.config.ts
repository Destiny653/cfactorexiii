import { Logger } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      Logger.log("fileS: ",file)
      const randomName = uuid();
      const fullFileName = `${randomName}${extname(file.originalname)}`;
      Logger.log(`Generated filename: ${fullFileName}`, 'Multer');
      cb(null, fullFileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
};
