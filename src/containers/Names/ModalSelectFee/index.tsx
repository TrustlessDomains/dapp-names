import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { Transaction } from 'ethers';
import { toast } from 'react-hot-toast';
import * as TC_SDK from 'trustless-computer-sdk';
import BigNumber from 'bignumber.js';

import IconSVG from '@/components/IconSVG';
import { CDN_URL, TC_WEB_URL, TRANSFER_TX_SIZE } from '@/configs';
import Button from '@/components/Button';
import Text from '@/components/Text';
import { formatBTCPrice, stringToBuffer } from '@trustless-computer/dapp-core';
import { AssetsContext } from '@/contexts/assets-context';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import usePreserveChunks, {
  IPreserveChunkParams,
} from '@/hooks/contract-operations/bns/usePreserveChunks';
import useRegister, {
  IRegisterNameParams,
} from '@/hooks/contract-operations/bns/useRegister';
import ToastConfirm from '@/components/ToastConfirm';
import { showToastError } from '@/utils/toast';
import { DappsTabs } from '@/enums/tabs';
import { walletLinkSignTemplate } from '@/utils/configs';
import logger from '@/services/logger';
import { getUserSelector } from '@/state/user/selector';
import { ERROR_CODE } from '@/constants/error';
import web3Provider from '@/connection/custom-web3-provider';
import EstimatedFee from '@/components/EstimatedFee';
import InsufficientFund from '@/components/InsufficientFund';

import { StyledModal, Title } from './ModalSelectFee.styled';

type Props = {
  show: boolean;
  handleClose: () => void;
  valueInput: string;
  setValueInput: (value: string) => void;
  setNameValidate?: (value: boolean) => void;
};

const ModalSelectFee = (props: Props) => {
  const {
    show = false,
    handleClose,
    valueInput,
    setValueInput,
    setNameValidate,
  } = props;
  const user = useSelector(getUserSelector);
  const { feeRate } = useContext(AssetsContext);
  const { estimateGas } = usePreserveChunks();

  const [isProcessing, setIsProcessing] = useState(false);
  const [estBTCFee, setEstBTCFee] = useState<string | null>(null);
  const [estTCFee, setEstTCFee] = useState<string | null>(null);

  const { run: registerName } = useContractOperation<
    IRegisterNameParams,
    Transaction | null
  >({
    operation: useRegister,
  });

  const { dAppType, transactionType } = useRegister();

  const calculateEstBtcFee = useCallback(async () => {
    if (!valueInput) return;

    try {
      setEstBTCFee(null);

      const tcTxSizeByte = TRANSFER_TX_SIZE + valueInput?.length;
      const estimatedEconomyFee = TC_SDK.estimateInscribeFee({
        tcTxSizeByte: tcTxSizeByte,
        feeRatePerByte: feeRate.hourFee,
      });

      setEstBTCFee(estimatedEconomyFee.totalFee.toString());
    } catch (err: unknown) {
      logger.error(err);
    }
  }, [valueInput, setEstBTCFee, feeRate.hourFee]);

  const calculateEstTcFee = useCallback(async () => {
    if (!valueInput || !estimateGas || !user) return;

    setEstTCFee(null);
    let payload: IPreserveChunkParams;

    try {
      const fileBuffer = Buffer.from(valueInput);
      payload = {
        address: user?.walletAddress as string,
        chunks: [fileBuffer],
      };
      const gasLimit = await estimateGas(payload);
      const gasPrice = await web3Provider.getGasPrice();
      const gasLimitBN = new BigNumber(gasLimit);
      const gasPriceBN = new BigNumber(gasPrice);
      const tcGas = gasLimitBN.times(gasPriceBN);
      logger.debug('TC Gas', tcGas.toString());
      setEstTCFee(tcGas.toString());
    } catch (err: unknown) {
      logger.error(err);
    }
  }, [valueInput, setEstTCFee, estimateGas, user]);

  useEffect(() => {
    calculateEstBtcFee();
  }, [calculateEstBtcFee]);

  useEffect(() => {
    calculateEstTcFee();
  }, [calculateEstTcFee]);

  const handleRegistered = async () => {
    console.log(valueInput);
    setIsProcessing(true);

    // Call contract
    try {
      const tx = await registerName({
        name: valueInput,
        selectFee: feeRate.hourFee,
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
      typeof setNameValidate === 'function' && setNameValidate(false);
    } catch (err) {
      if ((err as Error).message === ERROR_CODE.PENDING) {
        showToastError({
          message:
            'You have some pending transactions. Please complete all of them before moving on.',
          url: `${TC_WEB_URL}/?tab=${DappsTabs.TRANSACTION}`,
          linkText: 'Go to Wallet',
        });
      } else if ((err as Error).message === ERROR_CODE.INSUFFICIENT_BALANCE) {
        const byteCode = stringToBuffer(valueInput);

        const estimatedFee = TC_SDK.estimateInscribeFee({
          tcTxSizeByte: Buffer.byteLength(byteCode),
          feeRatePerByte: feeRate.hourFee,
        });

        showToastError({
          message: `Your balance is insufficient. Please top up at least ${formatBTCPrice(
            estimatedFee.totalFee.toString(),
          )} BTC to pay network fee.`,
          url: `${TC_WEB_URL}`,
          linkText: 'Go to Wallet',
        });
      } else {
        showToastError({
          message: (err as Error).message,
        });
      }

      console.log(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <StyledModal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header>
        <IconSVG
          className="icon-close"
          onClick={handleClose}
          src={`${CDN_URL}/icons/ic-close.svg`}
          maxWidth={'22px'}
        />
      </Modal.Header>
      <Modal.Body>
        <Title className="font-medium">{valueInput}</Title>
        <EstimatedFee
          classNames="estimated-fee"
          estimateBTCGas={estBTCFee}
          estimateTCGas={estTCFee}
          isBigFile={false}
          uploadView
        />
        <Button
          onClick={handleRegistered}
          className="upload-btn"
          disabled={isProcessing}
        >
          <Text size="medium" fontWeight="medium" className="upload-text">
            {isProcessing ? 'Processing...' : 'Register'}
          </Text>
        </Button>
        <InsufficientFund estTCFee={estTCFee} estBTCFee={estBTCFee} />
      </Modal.Body>
    </StyledModal>
  );
};

export default ModalSelectFee;
