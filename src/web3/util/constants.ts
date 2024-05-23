export class BlockchainSchemaConstants {
  static UINT256 = 'uint256';
  static UINT16 = 'uint16';
  static ADDRESS = 'address';
  static BYTES32 = 'bytes32';
  static DROPS = 'DropData[]';
  static MINTS = 'MintData[]';
  static STRING = 'string';
  static STRINGS = 'string[]';
  static PAYMENTS = 'Payment[]';
}

export class BlockchainEncodeConstants {
  static UINT256 = 'uint256';
  static UINT16 = 'uint16';
  static ADDRESS = 'address';
  static BYTES32 = 'bytes32';
  static STRING = 'string';
  static PAYMENTS = 'tuple[](uint256 amount, address recipient)';
}

export class Web3Constants {
  static RPC = 'RPC_PROVIDER';
  static CLIENT = 'WEB3_CLIENT';
}
