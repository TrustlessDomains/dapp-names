import { createSlice } from '@reduxjs/toolkit';

export interface GasFeeState {
  defaultTCGasFee: string;
  defaultBTCGasFee: string;
}

export const initialState: GasFeeState = {
  defaultTCGasFee: '0',
  defaultBTCGasFee: '0',
};

const gasFeeSlice = createSlice({
  name: 'gasFee',
  initialState,
  reducers: {
    updateDefaultTCGasFee(state, { payload }) {
      state.defaultTCGasFee = payload;
    },
    updateDefaultBTCGasFee(state, { payload }) {
      state.defaultBTCGasFee = payload;
    },
    resetGasFee(state) {
      state.defaultTCGasFee = '0';
      state.defaultBTCGasFee = '0';
    },
  },
});

export const { updateDefaultTCGasFee, updateDefaultBTCGasFee, resetGasFee } =
  gasFeeSlice.actions;

export default gasFeeSlice.reducer;
