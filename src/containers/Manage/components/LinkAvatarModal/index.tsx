import { useState, useEffect, useContext, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { Formik } from 'formik';
import * as TC_SDK from 'trustless-computer-sdk';
import BigNumber from 'bignumber.js';
import { FileUploader } from 'react-drag-drop-files';

import { IOwnedBNS } from '@/interfaces/bns';
import { compressFileAndGetSize } from '@/services/file';
import { BLOCK_CHAIN_FILE_LIMIT } from '@/constants/file';
import web3Provider from '@/connection/custom-web3-provider';
import { readFileAsBuffer } from '@/utils';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import usePreserveChunks, {
  IPreserveChunkParams,
} from '@/hooks/contract-operations/bns/usePreserveChunks';
import useSetAvatarToName, {
  ISetAvatarToNameParams,
} from '@/hooks/contract-operations/bns/useSetAvatarToName';
import { AssetsContext } from '@/contexts/assets-context';
import { CDN_URL, TRANSFER_TX_SIZE } from '@/configs';
import logger from '@/services/logger';
import { getUserSelector } from '@/state/user/selector';
import IconSVG from '@/components/IconSVG';
import Button from '@/components/Button';
import Text from '@/components/Text';
import EstimatedFee from '@/components/EstimatedFee';

import { StyledModal, Title, WrapDescription } from './LinkAvatarModal.styled';

interface IFormValue {
  file: File | null;
}

type IModal = {
  showModal: boolean;
  setShowModal: (arg: boolean) => void;
  domainSelecting: IOwnedBNS | null;
};

const LinkAvatarModal = ({ showModal, setShowModal, domainSelecting }: IModal) => {
  const user = useSelector(getUserSelector);

  const { run: setAvatarToName } = useContractOperation<
    ISetAvatarToNameParams,
    boolean
  >({
    operation: useSetAvatarToName,
    inscribeable: true,
  });

  const { estimateGas } = usePreserveChunks();
  const { feeRate } = useContext(AssetsContext);
  const [estBTCFee, setEstBTCFee] = useState<string | null>(null);
  const [estTCFee, setEstTCFee] = useState<string | null>(null);
  const mapDomainFormRef = useRef(null);
  const [file, setFile] = useState<File | null>(null);

  const calculateEstBtcFee = useCallback(async () => {
    if (!file) return;
    try {
      setEstBTCFee(null);

      let tcTxSizeByte = TRANSFER_TX_SIZE;
      if (file.size < BLOCK_CHAIN_FILE_LIMIT) {
        const fileBuffer = await readFileAsBuffer(file);
        const { compressedSize } = await compressFileAndGetSize({
          fileBase64: fileBuffer.toString('base64'),
        });
        tcTxSizeByte = TRANSFER_TX_SIZE + compressedSize;
      }
      const estimatedEconomyFee = TC_SDK.estimateInscribeFee({
        tcTxSizeByte: tcTxSizeByte,
        feeRatePerByte: feeRate.hourFee,
      });
      setEstBTCFee(estimatedEconomyFee.totalFee.toString());
    } catch (err: unknown) {
      logger.error(err);
    }
  }, [file, setEstBTCFee, feeRate.hourFee]);

  const calculateEstTcFee = useCallback(async () => {
    if (!file || !estimateGas || !user) return;

    setEstTCFee(null);
    let payload: IPreserveChunkParams;

    try {
      if (file.size < BLOCK_CHAIN_FILE_LIMIT) {
        const fileBuffer = await readFileAsBuffer(file);
        payload = {
          address: user.walletAddress as string,
          chunks: [fileBuffer],
        };
      } else {
        payload = {
          address: user.walletAddress as string,
          chunks: [],
        };
      }
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
  }, [file, setEstTCFee, estimateGas, user]);

  useEffect(() => {
    calculateEstBtcFee();
  }, [calculateEstBtcFee]);

  useEffect(() => {
    calculateEstTcFee();
  }, [calculateEstTcFee]);

  const handleClose = () => {
    setShowModal(false);
  };

  const onChangeFile = (file: File): void => {
    setFile(file);
  };

  const handleSubmit = async () => {
    if (!file || !domainSelecting?.tokenId) return;
    try {
      const fileBuffer = await readFileAsBuffer(file);
      const result = await setAvatarToName({
        tokenId: domainSelecting?.tokenId,
        fileBuffer,
        fileName: file?.name || 'test-file',
      });
      console.log('set avatar', result);
    } catch (error: unknown) {
      logger.error(error);
    }
  };

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};

    console.log('validateForm', values);

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
        />
      </Modal.Header>
      <Modal.Body>
        <Title className="font-medium">{domainSelecting?.name}</Title>
        <WrapDescription>#{domainSelecting?.tokenId}</WrapDescription>
        <div className="label">AVATAR</div>
        <Formik
          innerRef={mapDomainFormRef}
          key="create"
          initialValues={{
            file,
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <FileUploader
                handleChange={onChangeFile}
                name={'fileUploader'}
                classes={'dropZone'}
              ></FileUploader>
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

export default LinkAvatarModal;
