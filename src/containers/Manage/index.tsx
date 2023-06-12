import {
  useState,
  useMemo,
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

import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import usePreserveChunks, {
  IPreserveChunkParams,
} from '@/hooks/contract-operations/bns/usePreserveChunks';
import { AssetsContext } from '@/contexts/assets-context';
import { validateEVMAddress } from '@/utils/validate';
import { getBnsByWallet } from '@/services/bns-explorer';
import { CDN_URL, FETCH_LIMIT, TRANSFER_TX_SIZE } from '@/configs';
// import { ROUTE_PATH } from '@/constants/route-path';
import logger from '@/services/logger';
import { getUserSelector } from '@/state/user/selector';
import IconSVG from '@/components/IconSVG';
import Table from '@/components/Table';
import Button from '@/components/Button';
import Text from '@/components/Text';
import EstimatedFee from '@/components/EstimatedFee';

import {
  Container,
  StyledModalUpload,
  Title,
  WrapInput,
  WrapDescription,
} from './Manage.styled';

interface IFormValue {
  tcAddress: string;
}

const Manage = () => {
  const user = useSelector(getUserSelector);

  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [yourListDomains, setYourListDomains] = useState<any>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [domainSelecting, setDomainSelecting] = useState(null);

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
    console.log(1111, mapDomainFormRef?.current);
    try {
      setEstBTCFee(null);

      const tcTxSizeByte = TRANSFER_TX_SIZE;
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

  useEffect(() => {
    calculateEstBtcFee();
  }, [calculateEstBtcFee]);

  const fetchListDomains = async (p?: number): Promise<void> => {
    if (!user.tcAddress) return;

    try {
      setLoading(true);
      const page = p || Math.floor(yourListDomains.length / FETCH_LIMIT) + 1;
      const res = await getBnsByWallet({
        page,
        limit: FETCH_LIMIT,
        walletAddress: user.tcAddress,
      });

      if (res.length < FETCH_LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

      if (page === 1) {
        setYourListDomains(res);
      } else {
        setYourListDomains((prev) => [...prev, ...res]);
      }
    } catch (err: unknown) {
      logger.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListDomains();
  }, [user.tcAddress]);

  // useEffect(() => {
  //   if (domainSelecting) {
  //     setShowModal(true);
  //   }
  //   return () => {
  //     console.log(2222);
  //     setDomainSelecting(null);
  //   };
  // }, [domainSelecting]);

  const tableData = useMemo(() => {
    return yourListDomains?.map((item) => ({
      id: item?.id,
      render: {
        info: <span>{item?.tokenId}</span>,
        bns: <span>{item?.name}</span>,
        transaction: (
          <>{item?.transaction ? <span>{item.transaction}</span> : <span>-</span>}</>
        ),
        date: <>{item?.date ? <span>{item.date}</span> : <span>-</span>}</>,
        avatar: <>{item?.avatar ? <span>{item.avatar}</span> : <span>-</span>}</>,
        address: (
          <>{item?.resolver ? <span>{item.resolver}</span> : <span>-</span>}</>
        ),
        action: (
          <div
            onClick={() => {
              setDomainSelecting(item);
              setShowModal(true);
            }}
          >
            Config BNS
          </div>
        ),
      },
    }));
  }, [yourListDomains]);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit = () => {};

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
    <Container>
      <p className="title">Manage your BNS</p>
      {/* <div className="flex empty">
        <IconSVG
          src={`${CDN_URL}/icons/open-box.svg`}
          maxWidth="222"
          maxHeight="229"
        />
        <p className="text-center">
          You have no BNS.
          <Link className="logo" href={ROUTE_PATH.HOME}>
            Register Now.
          </Link>
        </p>
      </div> */}
      <div>
        <Table
          tableHead={[
            '#',
            'BNS',
            'TRANSACTION ID',
            'DATE & TIME',
            'AVATAR',
            'ADDRESS',
            'ACTION',
          ]}
          data={tableData}
          className="activity-table"
        />
      </div>
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
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
            }) => (
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
    </Container>
  );
};

export default Manage;
