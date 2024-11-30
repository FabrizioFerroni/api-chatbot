import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const { body } = context.switchToHttp().getRequest<Request>();

    const bodyDto = plainToClass(LoginDto, body);

    const errors = await validate(bodyDto);

    const errorMessages = errors.flatMap(({ constraints }) =>
      Object.values(constraints),
    );

    if (errorMessages.length > 0) {
      throw new BadRequestException(errorMessages);
    }

    return super.canActivate(context) as boolean | Promise<boolean>;
  }
}
