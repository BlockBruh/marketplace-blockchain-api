import { CacheInterceptor, ExecutionContext } from '@nestjs/common';
import { InterceptorConstants } from '../util/constants';
import { CachedMethods } from '../util/enums';

export class CustomCacheInterceptor extends CacheInterceptor {
  protected isRequestCacheable(context: ExecutionContext): boolean {
    const http = context.switchToHttp();
    const request = http.getRequest();

    const ignoreCaching: boolean = this.reflector.get(
      InterceptorConstants.IGNORE,
      context.getHandler(),
    );
    const isRightMethod = Object.values(CachedMethods).includes(request.method);
    return !ignoreCaching && isRightMethod;
  }
}
