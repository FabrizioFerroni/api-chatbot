import { configApp } from '@/config/app/config.app';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { VerifyCallback } from 'passport-google-oauth20';
import { GoogleResponse } from '../interfaces/google-response.interface';
import { AuthService } from '../service/auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: configApp().google.clientId,
      clientSecret: configApp().google.clientSecret,
      callbackURL: configApp().google.callbackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: GoogleResponse,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    done: VerifyCallback,
  ) {
    const { emails } = profile;

    const email = emails[0].value;

    const user = await this.authService.validateGoogleUser(email);

    if (!user) {
      return await this.authService.createAccountGoogleUser(profile);
    }

    done(null, user);
  }
}
