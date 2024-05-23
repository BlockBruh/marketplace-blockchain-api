import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongContractException extends HttpException {
  constructor(error: Error, address: string) {
    const errorBody = HttpException.createBody({
      error: error.message + ', address: ' + address,
      errorType: HttpStatus.NOT_FOUND,
    });
    super(errorBody, HttpStatus.NOT_FOUND, { cause: error });
  }
}
