import { Module } from '@nestjs/common';
import { TokenService } from './service/token.service';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { configApp } from '@/config/app/config.app';
import { TransformDto } from '@/shared/utils';
import { TokenEntity } from './entity/token.entity';
import { TokenInterfaceRepository } from './repository/token.interface.repository';
import { TokenRepository } from './repository/token.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TokenEntity]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: configApp().secret_jwt,
          signOptions: {
            expiresIn: '10m',
          },
        };
      },
    }),
  ],
  providers: [
    TokenService,
    {
      provide: TokenInterfaceRepository,
      useClass: TokenRepository,
    },
    TransformDto,
  ],
  exports: [TokenService, TransformDto],
})
export class TokenModule {}
