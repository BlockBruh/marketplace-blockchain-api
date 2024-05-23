import { HttpException, HttpStatus } from '@nestjs/common';

export class DeprecatedException extends HttpException {
  constructor(newController: string, newPath: string) {
    const errorBody = HttpException.createBody({
      error: `See: ${newController} controller at ${newPath}`,
      errorType: HttpStatus.SEE_OTHER,
    });
    super(errorBody, HttpStatus.SEE_OTHER, {});
  }
}
