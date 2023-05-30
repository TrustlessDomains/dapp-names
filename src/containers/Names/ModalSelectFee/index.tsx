import React, { useContext, useEffect, useState } from 'react';
import { StyledModalSelectFee } from './ModalSelectFee.styled';
import { Modal } from 'react-bootstrap';
import IconSVG from '@/components/IconSVG';
import { CDN_URL } from '@/configs';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { formatBTCPrice, stringToBuffer } from '@trustless-computer/dapp-core';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import useRegister, {
  IRegisterNameParams,
} from '@/hooks/contract-operations/bns/useRegister';
import { showToastError, showToastSuccess } from '@/utils/toast';
import * as TC_SDK from 'trustless-computer-sdk';
import { MempoolContext } from '@/contexts/mempool-context';
import { IRequestSignResp } from 'tc-connect';
import { useSelector } from 'react-redux';
import { getUserSelector } from '@/state/user/selector';
import { useRouter } from 'next/router';
import { ROUTE_PATH } from '@/constants/route-path';

type Props = {
  show: boolean;
  handleClose: () => void;
  valueInput: string;
  setValueInput: (value: string) => void;
  setNameValidate: (value: boolean) => void;
};

enum optionFees {
  economy = 'Economy',
  faster = 'Faster',
  fastest = 'Fastest',
}

const ModalSelectFee = (props: Props) => {
  const {
    show = false,
    handleClose,
    valueInput,
    setValueInput,
    setNameValidate,
  } = props;
  const user = useSelector(getUserSelector);
  const router = useRouter();

  const { feeRate } = useContext(MempoolContext);

  const [isProcessing, setIsProcessing] = useState(false);

  const [estBTCFee, setEstBTCFee] = useState({
    economy: '0',
    faster: '0',
    fastest: '0',
  });

  const { run: registerName } = useContractOperation<
    IRegisterNameParams,
    IRequestSignResp | null
  >({
    operation: useRegister,
  });

  const handleEstFee = () => {
    const byteCode = stringToBuffer(valueInput);
    const estimatedFastestFee = TC_SDK.estimateInscribeFee({
      tcTxSizeByte: Buffer.byteLength(byteCode),
      feeRatePerByte: feeRate.fastestFee,
    });
    const estimatedFasterFee = TC_SDK.estimateInscribeFee({
      tcTxSizeByte: Buffer.byteLength(byteCode),
      feeRatePerByte: feeRate.halfHourFee,
    });
    const estimatedEconomyFee = TC_SDK.estimateInscribeFee({
      tcTxSizeByte: Buffer.byteLength(byteCode),
      feeRatePerByte: feeRate.hourFee,
    });

    setEstBTCFee({
      fastest: estimatedFastestFee.totalFee.toString(),
      faster: estimatedFasterFee.totalFee.toString(),
      economy: estimatedEconomyFee.totalFee.toString(),
    });
  };

  const handleRegistered = async () => {
    if (!user.tcAddress) {
      router.push(ROUTE_PATH.CONNECT_WALLET);
      return;
    }
    setIsProcessing(true);

    // Call contract
    try {
      await registerName({
        name: valueInput,
        owner: user.tcAddress,
      });

      showToastSuccess({
        message: 'Registered successfully.'
      })

      setValueInput('');
      setNameValidate(false);
      handleClose();
    } catch (err) {
      showToastError({
        message: (err as Error).message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderEstFee = ({
    title,
    estFee,
    feeRate,
  }: {
    title: optionFees;
    estFee: string;
    feeRate: number;
  }) => {
    return (
      <div
        className={`est-fee-item`}
      >
        <div>
          <Text fontWeight="medium" color="bg1" size="regular">
            {title}
          </Text>
          <Text color="border2" className="mb-10">
            {feeRate} sats/vByte
          </Text>
          <p className="ext-price">
            {formatBTCPrice(estFee)} <span>BTC</span>
          </p>
        </div>
      </div>
    );
  };

  useEffect(() => {
    handleEstFee();
  }, [valueInput, feeRate]);

  return (
    <StyledModalSelectFee show={show} onHide={handleClose} centered>
      <Modal.Header>
        <IconSVG
          className="cursor-pointer"
          onClick={handleClose}
          src={`${CDN_URL}/icons/ic-close-1.svg`}
          maxWidth={'22px'}
        />
      </Modal.Header>
      <Modal.Body>
        <p className="modal-title">Estimate network fee</p>
        <div className="est-fee">
          <div className="est-fee-options">
            {renderEstFee({
              title: optionFees.economy,
              estFee: estBTCFee.economy,
              feeRate: feeRate.hourFee,
            })}
            {renderEstFee({
              title: optionFees.faster,
              estFee: estBTCFee.faster,
              feeRate: feeRate.halfHourFee,
            })}
            {renderEstFee({
              title: optionFees.fastest,
              estFee: estBTCFee.fastest,
              feeRate: feeRate.fastestFee,
            })}
          </div>
        </div>
        <div className="confirm">
          <Button
            disabled={isProcessing}
            type="submit"
            className="confirm-btn"
            onClick={handleRegistered}
          >
            <Text size="medium" fontWeight="medium" className="confirm-text">
              {isProcessing ? 'Processing...' : 'Register'}
            </Text>
          </Button>
        </div>
      </Modal.Body>
    </StyledModalSelectFee>
  );
};

export default ModalSelectFee;
