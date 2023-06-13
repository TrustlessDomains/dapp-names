import { useState, useEffect, useContext, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { Formik } from 'formik';
import * as TC_SDK from 'trustless-computer-sdk';
import BigNumber from 'bignumber.js';

import web3Provider from '@/connection/custom-web3-provider';
import { IOwnedBNS } from '@/interfaces/bns';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import usePreserveChunks, {
  IPreserveChunkParams,
} from '@/hooks/contract-operations/bns/usePreserveChunks';
import useMapNameToAddress, {
  IMapNameToAddressParams,
} from '@/hooks/contract-operations/bns/useMapNameToAddress';
import { AssetsContext } from '@/contexts/assets-context';
import { validateEVMAddress } from '@/utils/validate';
import { CDN_URL, TRANSFER_TX_SIZE } from '@/configs';
import logger from '@/services/logger';
import { getUserSelector } from '@/state/user/selector';
import IconSVG from '@/components/IconSVG';
import Button from '@/components/Button';
import Text from '@/components/Text';
import EstimatedFee from '@/components/EstimatedFee';

import {
  StyledModal,
  Title,
  WrapInput,
  WrapDescription,
} from './LinkAddressModal.styled';

type IFormValue = {
  tcAddress: string;
};

type IModal = {
  showModal: boolean;
  setShowModal: (arg: boolean) => void;
  domainSelecting: IOwnedBNS | null;
};

const LinkAddressModal = ({ showModal, setShowModal, domainSelecting }: IModal) => {
  const user = useSelector(getUserSelector);

  const { run: mapNameToAddress } = useContractOperation<
    IMapNameToAddressParams,
    boolean
  >({
    operation: useMapNameToAddress,
    inscribeable: true,
  });

  const { estimateGas } = usePreserveChunks();
  const { feeRate } = useContext(AssetsContext);
  const [estBTCFee, setEstBTCFee] = useState<string | null>(null);
  const [estTCFee, setEstTCFee] = useState<string | null>(null);
  const [valueInput, setValueInput] = useState<string>('');

  const calculateEstBtcFee = useCallback(async () => {
    if (!valueInput || !validateEVMAddress(valueInput)) return;

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
    if (!valueInput || !validateEVMAddress(valueInput) || !estimateGas || !user)
      return;

    setEstTCFee(null);
    let payload: IPreserveChunkParams;

    try {
      const fileBuffer = Buffer.from(valueInput);
      payload = {
        address: user?.walletAddress as string,
        chunks: [fileBuffer],
      };
      // }
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

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    if (!domainSelecting?.tokenId) return;
    try {
      await mapNameToAddress({
        to: valueInput,
        tokenId: domainSelecting?.tokenId,
      });
    } catch (err: unknown) {
      logger.error(err);
    }
  };

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!values.tcAddress) {
      errors.tcAddress = 'TC address is required.';
    } else if (!validateEVMAddress(values.tcAddress)) {
      errors.tcAddress = 'Invalid wallet address.';
    }

    return errors;
  };

  return (
    <StyledModal show={showModal} onHide={handleClose} centered backdrop="static">
      <Modal.Header>
        <IconSVG
          className="icon-close"
          onClick={handleClose}
          src={`${CDN_URL}/icons/ic-close.svg`}
          maxWidth={'22px'}
          color="white"
        />
      </Modal.Header>
      <Modal.Body>
        <Title className="font-medium">{domainSelecting?.name}</Title>
        <WrapDescription>#{domainSelecting?.tokenId}</WrapDescription>
        <Formik
          key="create"
          initialValues={{
            tcAddress: '',
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <WrapInput>
                <p className="title-input">LINK TO TC ADDRESS</p>
                <input
                  id="tcAddress"
                  type="text"
                  name="tcAddress"
                  onChange={(evt) => {
                    setValueInput(evt.target.value);
                    handleChange(evt);
                  }}
                  onBlur={handleBlur}
                  value={values.tcAddress}
                  className="input"
                  placeholder="Paste your TC address"
                  // disabled={isProcessing}
                />
                {errors.tcAddress && touched.tcAddress && (
                  <p className="error">{errors.tcAddress}</p>
                )}
              </WrapInput>
              <EstimatedFee
                classNames="estimated-fee"
                estimateBTCGas={estBTCFee}
                estimateTCGas={estTCFee}
                isBigFile={false}
                uploadView
              />
              <Button
                type="submit"
                className="upload-btn"
                // disabled={isProcessing}
              >
                <Text size="medium" fontWeight="medium" className="upload-text">
                  {/* {isProcessing ? 'Updating...' : 'Update'} */}
                  Update
                </Text>
              </Button>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </StyledModal>
  );
};

export default LinkAddressModal;
