import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/response/response-auth.dto';
import { AuthService } from '../service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    const dto: LoginDto = {
      email,
      password,
    };

    const user: AuthResponseDto = await this.authService.login(dto);

    if (!user) {
      throw new UnauthorizedException('Not Allowed');
    }

    return user;
  }
}
