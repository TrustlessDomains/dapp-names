import { useState, useEffect, useContext, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';
import { Formik } from 'formik';
import * as TC_SDK from 'trustless-computer-sdk';
import BigNumber from 'bignumber.js';
import { FileUploader } from 'react-drag-drop-files';
import { Transaction } from 'ethers';
import { prettyPrintBytes } from '@trustless-computer/dapp-core';

import { showToastError } from '@/utils/toast';
import { IOwnedBNS } from '@/interfaces/bns';
import { compressFileAndGetSize } from '@/services/file';
import {
  BLOCK_CHAIN_FILE_LIMIT,
  IMAGE_EXTENSIONS,
  MAX_FILE_SIZE,
} from '@/constants/file';
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
import MediaPreview from '@/components/ThumbnailPreview/MediaPreview';
import InsufficientFund from '@/components/InsufficientFund';

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
    Transaction | null
  >({
    operation: useSetAvatarToName,
    inscribeable: true,
  });

  const { estimateGas } = usePreserveChunks();
  const { feeRate } = useContext(AssetsContext);
  const [estBTCFee, setEstBTCFee] = useState<string | null>(null);
  const [estTCFee, setEstTCFee] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);

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

  useEffect(() => {
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  }, [file]);

  const handleClose = () => {
    setShowModal(false);
    // reset image upload
    setFile(null);
    setPreview('');
  };

  const onChangeFile = (file: File | null): void => {
    setFile(file);
  };

  const handleSubmit = async () => {
    if (!file || !domainSelecting?.tokenId) return;

    setIsProcessing(true);
    try {
      const fileBuffer = await readFileAsBuffer(file);
      await setAvatarToName({
        tokenId: domainSelecting?.tokenId,
        fileBuffer,
        fileName: file?.name || 'test-file',
      });
    } catch (error: unknown) {
      logger.error(error);
      showToastError({
        message: (error as { message: string })?.message,
      });
    }
    setIsProcessing(false);
  };

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!values?.file) {
      errors.file = 'Avatar is required.';
    }
    return errors;
  };

  const onSizeError = () => {
    showToastError({
      message: `File size error, maximum file size is ${MAX_FILE_SIZE * 1000}kb.`,
    });
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
          key="create"
          initialValues={{
            file,
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, errors, setFieldValue }) => (
            <form onSubmit={handleSubmit}>
              <FileUploader
                fileOrFiles={file}
                disabled={isProcessing}
                handleChange={(uploadFile: File) => {
                  onChangeFile(uploadFile);
                  setFieldValue('file', uploadFile);
                }}
                name="file"
                types={IMAGE_EXTENSIONS}
                maxSize={MAX_FILE_SIZE}
                onSizeError={onSizeError}
              >
                {file ? (
                  <div className="preview-wrapper">
                    <div className="thumbnail-wrapper">
                      <MediaPreview
                        previewExt={file?.name?.split('.')?.pop() || ''}
                        previewUrl={preview || ''}
                      />
                    </div>
                    <div className="file-info">
                      {`${file.name} (${prettyPrintBytes(file.size)})`}
                    </div>
                  </div>
                ) : (
                  <div className="dropZoneHint">
                    <IconSVG
                      maxWidth={'60'}
                      maxHeight={'60'}
                      className="dropZoneThumbnail"
                      src={`${CDN_URL}/images/docs.svg`}
                    />
                    <div className="text-center">Upload your image file here.</div>
                  </div>
                )}
              </FileUploader>
              {errors?.file && <div className="error">{errors?.file}</div>}
              <EstimatedFee
                classNames="estimated-fee"
                estimateBTCGas={estBTCFee}
                estimateTCGas={estTCFee}
                isBigFile={false}
                uploadView
              />
              <Button type="submit" className="upload-btn" disabled={isProcessing}>
                <Text size="medium" fontWeight="medium" className="upload-text">
                  {isProcessing ? 'Updating...' : 'Update'}
                </Text>
              </Button>
            </form>
          )}
        </Formik>
        <InsufficientFund estTCFee={estTCFee} estBTCFee={estBTCFee} />
      </Modal.Body>
    </StyledModal>
  );
};

export default LinkAvatarModal;
