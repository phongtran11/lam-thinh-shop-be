import { Response } from 'express';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const raw = exception.getResponse();

    // Normalize shape
    const normalized = this.normalize(raw);

    this.logger.error(
      `${'error' in normalized ? normalized.error : ''} - ${normalized.message}`,
      exception.stack,
    );

    response.status(status).json(normalized);
  }

  private normalize(raw: string | Record<string, any>): {
    message: string;
    error?: string;
  } {
    if (typeof raw === 'string') {
      return { message: raw };
    }

    const { message, error } = raw as {
      message: string | string[];
      error?: string;
    };

    return {
      message: Array.isArray(message) ? message.join(', ') : message,
      ...(error ? { error } : {}),
    };
  }
}
