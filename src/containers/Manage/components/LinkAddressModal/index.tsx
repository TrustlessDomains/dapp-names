import {
  useState,
  // useMemo,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from 'react';
// import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { Formik } from 'formik';
import * as TC_SDK from 'trustless-computer-sdk';
import BigNumber from 'bignumber.js';

import web3Provider from '@/connection/custom-web3-provider';
import { IOwnedBNS } from '@/interfaces/bns';
// import { readFileAsBuffer } from '@/utils';
// import { BLOCK_CHAIN_FILE_LIMIT } from '@/constants/file';
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
// import { ROUTE_PATH } from '@/constants/route-path';
import logger from '@/services/logger';
import { getUserSelector } from '@/state/user/selector';
import IconSVG from '@/components/IconSVG';
import Button from '@/components/Button';
import Text from '@/components/Text';
import EstimatedFee from '@/components/EstimatedFee';

import {
  StyledModalUpload,
  Title,
  WrapInput,
  WrapDescription,
} from './LinkAddressModal.styled';

interface IFormValue {
  tcAddress: string;
}

const LinkAddressModal = ({ showModal, setShowModal, domainSelecting }) => {
  const user = useSelector(getUserSelector);

  const { run: mapNameToAddress } = useContractOperation<
    IMapNameToAddressParams,
    boolean
  >({
    operation: useMapNameToAddress,
    inscribeable: true,
  });

  const { run: preserveChunks } = useContractOperation<
    IPreserveChunkParams,
    Transaction | null
  >({
    operation: usePreserveChunks,
    inscribeable: true,
  });
  const { estimateGas } = usePreserveChunks();
  const { feeRate } = useContext(AssetsContext);
  const [estBTCFee, setEstBTCFee] = useState<string | null>(null);
  const [estTCFee, setEstTCFee] = useState<string | null>(null);
  const mapDomainFormRef = useRef(null);

  const calculateEstBtcFee = useCallback(async () => {
    try {
      setEstBTCFee(null);

      const tcTxSizeByte =
        TRANSFER_TX_SIZE + mapDomainFormRef?.current?.values?.tcAddress?.length;
      // if (file.size < BLOCK_CHAIN_FILE_LIMIT) {
      //   const fileBuffer = await readFileAsBuffer(file);
      //   const { compressedSize } = await compressFileAndGetSize({
      //     fileBase64: fileBuffer.toString('base64'),
      //   });
      //   tcTxSizeByte = TRANSFER_TX_SIZE + compressedSize;
      // }
      const estimatedEconomyFee = TC_SDK.estimateInscribeFee({
        tcTxSizeByte: tcTxSizeByte,
        feeRatePerByte: feeRate.hourFee,
      });

      setEstBTCFee(estimatedEconomyFee.totalFee.toString());
    } catch (err: unknown) {
      logger.error(err);
    }
  }, [mapDomainFormRef, setEstBTCFee, feeRate.hourFee]);

  const calculateEstTcFee = useCallback(async () => {
    if (!estimateGas || !user) return;

    setEstTCFee(null);
    let payload: IPreserveChunkParams;

    try {
      // if (file.size < BLOCK_CHAIN_FILE_LIMIT) {
      // const file = Buffer.from('0x57912f02709Ff6b3c7b00c9a6532e166C91e8E8D');
      const fileBuffer = Buffer.from(
        mapDomainFormRef?.current?.values?.tcAddress as string,
      );
      payload = {
        address: user.walletAddress,
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
  }, [mapDomainFormRef, setEstTCFee, estimateGas, user]);

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
    const result = await mapNameToAddress({
      to: mapDomainFormRef?.current?.values?.tcAddress,
      tokenId: domainSelecting?.tokenId,
    });
    console.log(11111, result, mapDomainFormRef?.current?.values?.tcAddress);
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
    <StyledModalUpload show={showModal} onHide={handleClose} centered>
      <Modal.Header>
        <IconSVG
          className="cursor-pointer"
          onClick={handleClose}
          src={`${CDN_URL}/icons/ic-close.svg`}
          maxWidth={'22px'}
        />
      </Modal.Header>
      <Modal.Body>
        <Title className="font-medium">{domainSelecting?.name}</Title>
        <WrapDescription>#{domainSelecting?.tokenId}</WrapDescription>
        <Formik
          innerRef={mapDomainFormRef}
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
                  onChange={handleChange}
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
                estimateBTCGas={estBTCFee}
                estimateTCGas={estTCFee}
                isBigFile={false}
                uploadView
              />
              <Button
                type="submit"
                bg="linear-gradient(90deg, #9796f0,#fbc7d4)"
                className="confirm-btn"
                // disabled={isProcessing}
                background={'linear-gradient(90deg, #9796f0,#fbc7d4)'}
              >
                <Text size="medium" fontWeight="medium" className="confirm-text">
                  {/* {isProcessing ? 'Updating...' : 'Update'} */}
                  Update
                </Text>
              </Button>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </StyledModalUpload>
  );
};

export default LinkAddressModal;
