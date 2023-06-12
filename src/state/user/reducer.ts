import { createSlice } from '@reduxjs/toolkit';
import { ConnectionType } from '@/connection';

export interface UserState {
  selectedWallet?: ConnectionType;
  btcAddress?: string;
  tcAddress?: string;
  walletAccounts?: Array<{
    btcAddress: string;
    tcAddress: string;
  }>;
}

export const initialState: UserState = {
  selectedWallet: undefined,
  btcAddress: undefined,
  tcAddress: undefined,
  walletAccounts: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateTcAddress(state, { payload }) {
      state.tcAddress = payload;
    },
    updateBtcAddress(state, { payload }) {
      state.btcAddress = payload;
    },
    updateWalletAccounts(state, { payload }) {
      state.walletAccounts = payload;
    },
    updateSelectedWallet(state, { payload: { wallet } }) {
      state.selectedWallet = wallet;
    },
    resetUser(state) {
      state.tcAddress = undefined;
      state.btcAddress = undefined;
      state.walletAccounts = [];
    },
  },
});

export const {
  resetUser,
  updateTcAddress,
  updateBtcAddress,
  updateWalletAccounts,
  updateSelectedWallet,
} = userSlice.actions;

export default userSlice.reducer;
