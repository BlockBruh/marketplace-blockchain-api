import { HttpException, HttpStatus } from '@nestjs/common';
import { BigNumberish } from 'ethers';

export class NonExistentException extends HttpException {
  constructor(error: Error, id: BigNumberish) {
    if ((error.message as string).includes('nonexistent')) {
      const errorBody = HttpException.createBody({
        error: error.message + ', id: ' + id.toString(),
        errorType: HttpStatus.NOT_FOUND,
      });
      super(errorBody, HttpStatus.NOT_FOUND, { cause: error });
    }
  }
}
