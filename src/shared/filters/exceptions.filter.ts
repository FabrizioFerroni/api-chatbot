import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiRoutes } from '@utils/index';
import { MessagesError } from '../utils/messages/errors/messages.errors';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(CustomExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const entorno = process.env.NODE_ENV;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resp = exception.getResponse();

      if (
        request.url === ApiRoutes.BASE_PATH &&
        status === HttpStatus.NOT_FOUND
      ) {
        return response.redirect('/');
      }

      const message =
        status === HttpStatus.TOO_MANY_REQUESTS
          ? MessagesError.TOO_MANY_REQUESTS
          : exception.message;

      const body = {
        messageException: message,
        message: resp,
        path: request.url,
        status_code: status,
        timestamp: new Date().toISOString(),
      };

      return response.status(status).json(body);
    } else {
      this.logger.error(exception);

      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: MessagesError.INTERNAL_EXCEPTION,
        messageServer: entorno === 'development' ? exception : null,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
