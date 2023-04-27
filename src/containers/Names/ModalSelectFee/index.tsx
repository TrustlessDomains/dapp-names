import React, { useContext, useEffect, useState } from 'react';
import { StyledModalSelectFee } from './ModalSelectFee.styled';
import { Modal } from 'react-bootstrap';
import IconSVG from '@/components/IconSVG';
import { CDN_URL, TC_WEB_URL } from '@/configs';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { formatBTCPrice, stringToBuffer } from '@trustless-computer/dapp-core';
import { AssetsContext } from '@/contexts/assets-context';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import useRegister, {
  IRegisterNameParams,
} from '@/hooks/contract-operations/bns/useRegister';
import { Transaction } from 'ethers';
import { toast } from 'react-hot-toast';
import ToastConfirm from '@/components/ToastConfirm';
import { showError } from '@/utils/toast';
import { DappsTabs } from '@/enums/tabs';
import { walletLinkSignTemplate } from '@/utils/configs';
import * as TC_SDK from 'trustless-computer-sdk';
import { ERROR_CODE } from '@/constants/error';

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

  const { feeRate } = useContext(AssetsContext);

  const [isProcessing, setIsProcessing] = useState(false);
  const [selectFee, setSelectFee] = useState<number>(0);
  const [activeFee, setActiveFee] = useState(optionFees.fastest);

  const [estBTCFee, setEstBTCFee] = useState({
    economy: '0',
    faster: '0',
    fastest: '0',
  });

  const { run: registerName } = useContractOperation<
    IRegisterNameParams,
    Transaction | null
  >({
    operation: useRegister,
  });

  const { dAppType, transactionType } = useRegister();

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
    console.log(valueInput);
    setIsProcessing(true);

    // Call contract
    try {
      const tx = await registerName({
        name: valueInput,
        selectFee,
      });
      toast.success(
        () => (
          <ToastConfirm
            id="create-success"
            url={walletLinkSignTemplate({
              transactionType,
              dAppType,
              hash: Object(tx).hash,
              isRedirect: true,
            })}
            message="Please go to your wallet to authorize the request for the Bitcoin transaction."
            linkText="Go to wallet"
          />
        ),
        {
          duration: 50000,
          position: 'top-right',
          style: {
            maxWidth: '900px',
            borderLeft: '4px solid #00AA6C',
          },
        },
      );

      setValueInput('');
      setNameValidate(false);
    } catch (err) {
      if ((err as Error).message === ERROR_CODE.PENDING) {
        showError({
          message:
            'You have some pending transactions. Please complete all of them before moving on.',
          url: `${TC_WEB_URL}/?tab=${DappsTabs.TRANSACTION}`,
          linkText: 'Go to Wallet',
        });
      } else if ((err as Error).message === ERROR_CODE.INSUFFICIENT_BALANCE) {
        const byteCode = stringToBuffer(valueInput);

        const estimatedFee = TC_SDK.estimateInscribeFee({
          tcTxSizeByte: Buffer.byteLength(byteCode),
          feeRatePerByte: selectFee,
        });

        showError({
          message: `Your balance is insufficient. Please top up at least ${formatBTCPrice(
            estimatedFee.totalFee.toString(),
          )} BTC to pay network fee.`,
          url: `${TC_WEB_URL}`,
          linkText: 'Go to Wallet',
        });
      } else {
        showError({
          message: (err as Error).message,
        });
      }

      console.log(err);
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
        className={`est-fee-item ${activeFee === title ? 'active' : ''}`}
        onClick={() => {
          setSelectFee(feeRate);
          setActiveFee(title);
        }}
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
        <p className="modal-title">Select the network fee</p>
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
