import { configApp } from '@/config/app/config.app';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaginationService } from './services/pagination.service';
import { MailService } from './services/mail.service';
import { HttpModule } from '@nestjs/axios';
import { DecryptCredentialService } from './services/decrypt-credential.service';
import { DecriptHeaderBodyMiddleware } from './middlewares/decriptheaderbody.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: false,
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}.local`],
      load: [configApp],
    }),
    HttpModule,
  ],
  providers: [
    PaginationService,
    MailService,
    DecryptCredentialService,
    DecriptHeaderBodyMiddleware,
  ],
  exports: [
    PaginationService,
    MailService,
    DecryptCredentialService,
    DecriptHeaderBodyMiddleware,
  ],
})
export class CoreModule {}
