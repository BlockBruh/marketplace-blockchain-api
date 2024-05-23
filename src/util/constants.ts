import { BigNumber } from 'ethers';

export class ConstraintsConstants {
  static ROYALTIES_PERCENT_MIN = BigNumber.from(0);
  static ROYALTIES_PERCENT_MAX = BigNumber.from(10000);
}
