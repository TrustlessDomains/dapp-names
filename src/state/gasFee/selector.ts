import { RootState } from '@/state';
import { GasFeeState } from './reducer';

export const getGasFeeSelector = (state: RootState): GasFeeState => state.gasFee;
