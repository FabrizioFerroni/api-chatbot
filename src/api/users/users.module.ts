import { Module } from '@nestjs/common';
import { UsersEntity } from './entity/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenModule } from '../token/token.module';
import { CoreModule } from '@/core/core.module';
import { ConfigModule } from '@nestjs/config';
import { configApp } from '@/config/app/config.app';
import { UserController } from './controller/user.controller';
import { UserService } from './service/user.service';
import { TransformDto } from '@/shared/utils';
import { UserRepository } from './repository/user.repository';
import { UserInterfaceRepository } from './repository/user.interface.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    TokenModule,
    CoreModule,
    ConfigModule.forRoot({
      isGlobal: false,
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}.local`],
      load: [configApp],
    }),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: UserInterfaceRepository,
      useClass: UserRepository,
    },
    TransformDto,
  ],
  exports: [UserService],
})
export class UsersModule {}
