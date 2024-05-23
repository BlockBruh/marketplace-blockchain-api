import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggerInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const correlationId = request.headers.correlation_id;
    this.logger.log(
      'Request to path: ' +
        request.url +
        ' with params: ' +
        JSON.stringify(request.params) +
        ', body: ' +
        JSON.stringify(request.body) +
        ', query params: ' +
        JSON.stringify(request.query),
      correlationId,
    );

    return next.handle().pipe(
      tap((response) => {
        this.logger.log('Response: ' + JSON.stringify(response), correlationId);
      }),
      catchError((err) => {
        this.logger.error(JSON.stringify(err.response), correlationId);
        throw err;
      }),
    );
  }
}
