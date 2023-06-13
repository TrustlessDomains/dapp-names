export enum TransactionStatus {
  PENDING = 'processing',
  CONFIRMED = 'confirmed',
  RESUME = 'pending',
}

export enum TransactionEventType {
  CREATE = 'Create',
  TRANSFER = 'Transfer',
  MINT = 'Mint',
  NONE = 'None',
  MAP = 'Map',
  SET_AVATAR = 'Set Avatar',
}
