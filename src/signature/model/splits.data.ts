import { Payment } from '../dto/inbound.interface';

export interface SplitsData {
  buyer: string;
  payments: Payment[];
  actionExpiration: number;
  token: string;
  nonce: string;
  tradeDataHash: string;
}
