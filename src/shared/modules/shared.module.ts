import { configApp } from '@/config/app/config.app';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      envFilePath: [`${process.cwd()}/.env`], //.${process.env.NODE_ENV}.local
      load: [configApp],
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, configApp().fileDest);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + file.originalname;
          cb(null, uniqueSuffix);
        },
      }),
    }),
  ],
  exports: [MulterModule],
})
export class SharedModule {
  constructor() {
    if (!fs.existsSync(configApp().fileDest)) {
      fs.mkdirSync(configApp().fileDest, { recursive: true });
    }
  }
}
