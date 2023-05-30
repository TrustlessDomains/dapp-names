import { createSlice } from '@reduxjs/toolkit';

export interface UserState {
  btcAddress?: string;
  tcAddress?: string;
  walletAccounts?: Array<{
    btcAddress: string;
    tcAddress: string;
  }>
}

export const initialState: UserState = {
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
} = userSlice.actions;

export default userSlice.reducer;
