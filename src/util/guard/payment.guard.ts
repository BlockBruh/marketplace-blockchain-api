import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { configService } from '../../config/config.service';

@Injectable()
export class PaymentGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return configService.getValue('NETWORK_NAME') === 'polygon';
  }
}
