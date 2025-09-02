import { HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { env } from 'process';
import { v4 as uuidv4 } from 'uuid';

export const multerFileConfig = {
  dest: () => process.env.RESOURCE_FOLDER_LOCATION,
};

export class FileTypesRegex {
  static IMAGE = new RegExp('^.*(jpe?g|png|gif)$', 'gi');
  static EXCEL = new RegExp('^.*xlsx$', 'gi');
  static PDF = new RegExp('^.*pdf$', 'gi');
  static MP3 = new RegExp('^.*(mp3|mpeg)$', 'gi');
  static WAV = new RegExp('^.*wav$', 'gi');
  static WMA = new RegExp('^.*wma$', 'gi');
  static ALL = new RegExp('.*', 'gi');
}

// export const excelUploadOptions = (location = '', required = false) => ({
//   limits: {
//     fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 1024 * 1024 * 10,
//   },
//   fileFilter: (_req: any, file: any, cb: any) => {
//     if (required && !file) {
//       cb(
//         new HttpException(`Файлыг заавал оруулна уу`, HttpStatus.BAD_REQUEST),
//         false,
//       );
//     }

//     if (
//       file.mimetype ===
//       'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
//     ) {
//       cb(null, true);
//     } else {
//       cb(
//         new HttpException(
//           `Файлын төрлийг хуулах боломжгүй байна. .xlsx өргөтгөлтэй файл оруулна уу.`,
//           HttpStatus.BAD_REQUEST,
//         ),
//         false,
//       );
//     }
//   },
//   storage: diskStorage({
//     destination: (_req: any, _file: any, cb: any) => {
//       const uploadPath = multerFileConfig.dest() + '/' + location;

//       if (!existsSync(uploadPath)) {
//         mkdirSync(uploadPath);
//       }

//       cb(null, uploadPath);
//     },
//     filename: (_req: any, file: any, cb: any) => {
//       const uniqueName = uuidv4() + extname(file.originalname);

//       cb(null, uniqueName);
//     },
//   }),
// });

export const fileUploadOptions = (
  type = FileTypesRegex.ALL,
  location = '',
  required = false,
) => ({
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 1024 * 1024 * 5,
  },
  fileFilter: (_req: any, file: any, cb: any) => {
    if (required && !file) {
      cb(
        new HttpException(`Файлыг заавал оруулна уу`, HttpStatus.BAD_REQUEST),
        false,
      );
    }

    if (file.mimetype.match(type)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Файлын төрлийг хуулах боломжгүй байна. ${extname(
            file.originalname,
          )}`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: (_req: any, _file: any, cb: any) => {
      const uploadPath = multerFileConfig.dest() + '/' + location;

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }

      cb(null, uploadPath);
    },
    filename: (_req: any, file: any, cb: any) => {
      const uniqueName = uuidv4() + extname(file.originalname);

      cb(null, uniqueName);
    },
  }),
});

export const MP3UploadOptions = (
  type = FileTypesRegex.MP3,
  location = '',
  required = false,
) => ({
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 1024 * 1024 * 5,
  },
  fileFilter: (_req: any, file: any, cb: any) => {
    if (required && !file) {
      cb(
        new HttpException(`Файлыг заавал оруулна уу`, HttpStatus.BAD_REQUEST),
        false,
      );
    }

    if (file.mimetype.match(type)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Файлын төрлийг хуулах боломжгүй байна. .MP3 өргөтгөлтэй файл оруулна уу.`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: (_req: any, _file: any, cb: any) => {
      const uploadPath = multerFileConfig.dest() + '/' + location;

      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }

      cb(null, uploadPath);
    },
    filename: (_req: any, file: any, cb: any) => {
      const uniqueName = uuidv4() + extname(file.originalname);

      cb(null, uniqueName);
    },
  }),
});

// export const wmaUploadOptions = (
//   type = FileTypesRegex.WMA,
//   location = '',
//   required = false,
// ) => ({
//   limits: {
//     fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 1024 * 1024 * 5,
//   },
//   fileFilter: (_req: any, file: any, cb: any) => {
//     if (required && !file) {
//       cb(
//         new HttpException(`Файлыг заавал оруулна уу`, HttpStatus.BAD_REQUEST),
//         false,
//       );
//     }

//     if (file.mimetype.match(type)) {
//       cb(null, true);
//     } else {
//       cb(
//         new HttpException(
//           `Файлын төрлийг хуулах боломжгүй байна. .wma өргөтгөлтэй файл оруулна уу.`,
//           HttpStatus.BAD_REQUEST,
//         ),
//         false,
//       );
//     }
//   },
//   storage: diskStorage({
//     destination: (_req: any, _file: any, cb: any) => {
//       const uploadPath = multerFileConfig.dest() + '/' + location;

//       if (!existsSync(uploadPath)) {
//         mkdirSync(uploadPath);
//       }

//       cb(null, uploadPath);
//     },
//     filename: (_req: any, file: any, cb: any) => {
//       const uniqueName = uuidv4() + extname(file.originalname);
//       cb(null, uniqueName);
//     },
//   }),
// });
// export function imageUrl(imgUrl: string): string | null {
//   if (!imgUrl) return null;
//   const baseUrl = process.env.RESOURCE_DOMAIN;
//   return `${baseUrl}${imgUrl.startsWith('/') ? imgUrl : `/${imgUrl}`}`;
// }

export const imageUploadOptions = (
  type = FileTypesRegex.IMAGE,
  location = '',
  required = false,
) => ({
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 1024 * 1024 * 10, // Default to 5MB if not specified
  },
  fileFilter: (_req: any, file: any, cb: any) => {
    if (required && !file) {
      cb(
        new HttpException(`Файлыг заавал оруулна уу`, HttpStatus.BAD_REQUEST),
        false,
      );
    }

    if (file.mimetype.match(type)) {
      cb(null, true);
    } else {
      cb(
        new HttpException(
          `Файлын төрлийг хуулах боломжгүй байна.`,
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: (_req: any, _file: any, cb: any) => {
      const uploadPath = multerFileConfig.dest() + '/' + location;
      console.log('Upload path=====>:', uploadPath);

      // if (!existsSync(uploadPath)) {
      //   mkdirSync(uploadPath, { recursive: true }); 
      // }
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }

      cb(null, uploadPath);
    },
    filename: (_req: any, file: any, cb: any) => {
      const uniqueName = uuidv4() + extname(file.originalname);

      console.log('Generated file name:', uniqueName);

      cb(null, uniqueName);
    },
  }),
});
