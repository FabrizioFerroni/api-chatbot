import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { configApp } from '@/config/app/config.app';
import { TokenDto } from '../dto/token.dto';
import { UserService } from '@/api/users/service/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configApp().secret_jwt,
      ignoreExpiration: false,
    });
  }

  async validate(payload: TokenDto) {
    /* return payload; */

    const user = await this.userService.getUserById(payload['id']);

    if (!user) throw new UnauthorizedException('Not Authorized');

    return user;
  }
}
