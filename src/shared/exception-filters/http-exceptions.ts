import { Response } from 'express';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionLoggerFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionLoggerFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();
    this.logger.error(exception.stack);
    response.status(status).json({
      statusCode: status,
      message: errorResponse,
    });
  }
}
