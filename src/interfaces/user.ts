export type User = {
  tcAddress: string;
  btcAddress: string;
  accounts: Array<{
    tcAddress: string;
    btcAddress: string;
  }>;
};
