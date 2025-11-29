import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Readable } from 'stream';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  StreamableFile,
  HttpStatus,
} from '@nestjs/common';
import { SuccessResponseDto } from 'src/shared/dtos/response.dto';

type ResponseWrapper<T> =
  | SuccessResponseDto<T>
  | StreamableFile
  | Readable
  | Buffer<any>
  | undefined;

@Injectable()
export class GlobalResponseInterceptor<T>
  implements NestInterceptor<T, ResponseWrapper<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseWrapper<T>> {
    const http = context.switchToHttp();
    const response = http.getResponse<Response>();
    return next.handle().pipe(
      map((data: any) => {
        // 1. If response already sent manually, do nothing.
        if (response.headersSent) {
          return data as SuccessResponseDto<T>;
        }

        // 2. Raw stream/file cases
        if (
          data instanceof StreamableFile ||
          data instanceof Readable ||
          data instanceof Buffer
        ) {
          return data; // let Nest handle raw streaming
        }

        // 3. Already normalized envelope
        if (
          data &&
          typeof data === 'object' &&
          'message' in data &&
          'data' in data
        ) {
          return data as SuccessResponseDto<T>;
        }

        // 5. Empty/null result (could be 204)
        if (
          (data === null || typeof data === 'undefined') &&
          response.statusCode === (HttpStatus.NO_CONTENT as number)
        ) {
          // 204 No Content
          return;
        }

        // 6. Default wrap
        return {
          message: 'success',
          data: data as T,
        };
      }),
    );
  }
}
