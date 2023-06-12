import React from 'react';
import Text from '@/components/Text';
import { formatBTCPrice, formatEthPrice } from '@/utils/format';
import { Wrapper } from './EstimatedFee.styled';
import EllipsisLoading from '../EllipsisLoading';

interface IProps {
  estimateBTCGas: string | null;
  estimateTCGas: string | null;
  classNames?: string;
  isBigFile?: boolean;
  uploadView?: boolean;
}

const EstimatedFee: React.FC<IProps> = ({
  estimateBTCGas,
  estimateTCGas,
  classNames,
  isBigFile = false,
  uploadView = false,
}: IProps): React.ReactElement => {
  return (
    <Wrapper className={classNames}>
      <div className="est-fee">
        <Text
          className="est-fee-title"
          size="regular"
          fontWeight="medium"
          color="bg1"
        >
          Network fee estimation {isBigFile && uploadView && '(Reserve only)'}
        </Text>
        <div className="est-fee-options">
          <div className={`est-fee-item`}>
            <p className="est-fee-item-title">BTC network fee</p>
            <p className="est-fee-item-value">
              {estimateBTCGas ? (
                `~ ${formatBTCPrice(estimateBTCGas)} BTC`
              ) : (
                <EllipsisLoading />
              )}
            </p>
          </div>
          <div className={`est-fee-item`}>
            <p className="est-fee-item-title">TC network fee</p>
            <p className="est-fee-item-value">
              {estimateTCGas ? (
                `~ ${formatEthPrice(estimateTCGas)} TC`
              ) : (
                <EllipsisLoading />
              )}
            </p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(EstimatedFee);
