import { IsDefined, MinLength } from 'class-validator';
import { Expose } from 'class-transformer';

export interface ResponseDTO<T> {
  response: T;
}

export class CorrelationHeaderDTO {
  @IsDefined()
  @MinLength(1)
  @Expose({ name: 'correlation_id' })
  correlation_id: string;
}
