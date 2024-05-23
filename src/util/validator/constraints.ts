import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { BigNumber } from 'ethers';
import { isHexString, strip0x } from '../binaryUtils';
import { ConstraintsConstants } from '../constants';

@ValidatorConstraint({ name: 'isHexOfLength', async: false })
export class IsValidHexOfLength implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return (
      text && isHexString(text) && strip0x(text).length == args.constraints[0]
    );
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `($property) should be a hex number of length!`;
  }
}

@ValidatorConstraint({ name: 'isHex', async: false })
export class IsValidHex implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return text && isHexString(text);
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `($property) should be a hex number!`;
  }
}

@ValidatorConstraint({ name: 'is20BytesHex', async: false })
export class IsValid20BytesHex extends IsValidHexOfLength {
  validate(text: string, args: ValidationArguments): boolean {
    args.constraints = [40];
    return super.validate(text, args);
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `($property) should be a hex number of length 40!`;
  }
}

@ValidatorConstraint({ name: 'is65BytesHex', async: false })
export class IsValid65BytesHex extends IsValidHexOfLength {
  validate(text: string, args: ValidationArguments): boolean {
    args.constraints = [130];
    return super.validate(text, args);
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `($property) should be a hex number of length 130!`;
  }
}

@ValidatorConstraint({ name: 'isIpfsUrl', async: false })
export class IsValidIpfsUrl implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments): boolean {
    return text.startsWith('ipfs://');
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `($property) is not a valid ipfs url!`;
  }
}

@ValidatorConstraint({ name: 'isBigNumber', async: false })
export class IsValidBigNumber implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments): boolean {
    return BigNumber.from(text) !== null;
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `($property) is not a valid ipfs url!`;
  }
}

@ValidatorConstraint({ name: 'isBigNumberArray', async: false })
export class IsValidBigNumberArray implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments): boolean {
    for (const value of args.value) {
      if (BigNumber.from(value) === null) return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `($property) is not a valid BigNumber array!`;
  }
}

@ValidatorConstraint({ name: 'is32ByteHex', async: false })
export class IsValid32BytesHex extends IsValidHexOfLength {
  validate(text: string, args: ValidationArguments): boolean {
    args.constraints = [64];
    return super.validate(text, args);
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `($property) should be a hex number of length 64!`;
  }
}

@ValidatorConstraint({ name: 'isBigNumberPercent', async: false })
export class IsValidBigNumberPercent implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return (
      BigNumber.from(text) &&
      BigNumber.from(text).gte(ConstraintsConstants.ROYALTIES_PERCENT_MIN) &&
      BigNumber.from(text).lte(ConstraintsConstants.ROYALTIES_PERCENT_MAX)
    );
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `($property) should be a valid bps value!`;
  }
}

@ValidatorConstraint({ name: 'IsValidBinary', async: false })
export class IsValidBinary implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return Number.parseInt(text) === 1 || Number.parseInt(text) === 0;
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return `($property) should be either 0 or 1!`;
  }
}
