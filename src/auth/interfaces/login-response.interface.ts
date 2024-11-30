import { AuthResponseDto } from '../dto/response/response-auth.dto';

export interface LoginResponseAuth {
  user?: AuthResponseDto;
  access_token: string;
  refresh_token: string;
}
