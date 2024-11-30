import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { MessagesCommon } from '../utils/messages/common/messages.common';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        const httpContext = context.switchToHttp();
        const response = httpContext.getResponse();
        const status_code = response.statusCode || HttpStatus.OK;

        return {
          message: MessagesCommon.REQUEST_SUCCESFULL,
          data,
          status_code,
        };
      }),
    );
  }
}
