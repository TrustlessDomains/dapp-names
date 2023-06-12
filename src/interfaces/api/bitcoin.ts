import * as TC_SDK from 'trustless-computer-sdk';
import BigNumber from 'bignumber.js';

export interface IInscriptionByOutput {
  [key: string]: TC_SDK.Inscription[];
}

export type IBlockStreamTxs = IPendingUTXO;

export interface ICollectedUTXOResp {
  availableUTXOs: TC_SDK.UTXO[];
  incomingUTXOs: TC_SDK.UTXO[];
  availableBalance: BigNumber;
  incomingBalance: BigNumber;
}

export enum FeeRateName {
  fastestFee = 'fastestFee',
  halfHourFee = 'halfHourFee',
  hourFee = 'hourFee',
}

export interface IFeeRate {
  [FeeRateName.fastestFee]: number;
  [FeeRateName.halfHourFee]: number;
  [FeeRateName.hourFee]: number;
}

interface Vin {
  txid: string;
  vout: number;
}

interface Vout {
  scriptpubkey_address: string;
  value: string;
  scriptpubkey: string;
}

export interface Status {
  confirmed: boolean;
}

export interface IPendingUTXO {
  vin: Vin[];
  vout: Vout[];
  status: Status;
  txid: string;
}

export type BINANCE_PAIR = 'ETHBTC';

export interface ITokenPriceResp {
  symbol: string;
  price: string;
}

export enum HistoryStatusType {
  pending = 'Pending',
  failed = 'Failed',
  success = 'Success',
  cancelling = 'cancelling',
  listing = 'listing',
  matched = 'matched',
  cancelled = 'cancelled',

  waitingPayment = 'Waiting for payment',
  receivedPayment = 'Payment received',
  buying = 'Buying',
  bought = 'Bought',
  refunding = 'Refunding',
  refunded = 'Refunded',
  expired = 'Expired',
}

export type HistoryStatusColor = '#ff7e21' | '#24c087' | '#ff4747' | '#5b5b5b';

export enum TrackTxType {
  normal = 'normal',
  inscription = 'inscription',
  buyInscription = 'buy-inscription',
  buySplit = 'buy-split-inscription',
  listSplit = 'list-split-inscription',
  list = 'list-inscription',
  cancel = 'cancel-list-inscription',
}
export interface ITxHistory {
  txhash: string;
  status: HistoryStatusType;
  statusColor: HistoryStatusColor;
  type: TrackTxType;
  inscription_id: string;
  inscription_number: number;
  send_amount: number;
  created_at: string;
  isExpired: boolean;
  inscription_list: string[];
  inscription_number_list: number[];
}
