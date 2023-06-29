import { useState, useMemo, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';

import { showToastError, showToastSuccess } from '@/utils/toast';
import { getUserSelector } from '@/state/user/selector';
import {
  getListResolversByWalletAddress,
  updateBnsDefault,
} from '@/services/bns-explorer';
import Button from '@/components/Button';
import IconSVG from '@/components/IconSVG';
import Table from '@/components/Table';
import Text from '@/components/Text';
import { CDN_URL } from '@/configs';
import { IOwnedBNS } from '@/interfaces/bns';
import useApiInfinite from '@/hooks/useApiInfinite';

import { StyledModal, Title } from './SetDefaultModal.styled';

type IModal = {
  showModal: boolean;
  setShowModal: (arg: boolean) => void;
  bnsDefault: IOwnedBNS | null;
  afterSetDefaultSuccess: () => Promise<void>;
};

const SetDefaultModal = ({
  showModal,
  setShowModal,
  bnsDefault,
  afterSetDefaultSuccess,
}: IModal) => {
  const user = useSelector(getUserSelector);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [currentResolver, setCurrentResolver] = useState<IOwnedBNS | null>(
    bnsDefault,
  );

  const {
    dataInfinite,
    loadMore,
    isLoadingMore,
    isReachingEnd,
    isEmpty,
    hasFirstFetching,
  } = useApiInfinite(
    getListResolversByWalletAddress,
    {
      walletAddress: user?.walletAddress,
    },
    { shouldFetch: !!user?.walletAddress },
  );

  useEffect(() => {
    if (bnsDefault && showModal) {
      setCurrentResolver(bnsDefault);
    }
  }, [bnsDefault, showModal]);

  const handleClose = () => {
    setShowModal(false);
  };

  const updateDefaultBns = async () => {
    if (user?.walletAddress && currentResolver?.tokenId) {
      setIsProcessing(true);

      try {
        const result = await updateBnsDefault(
          user?.walletAddress,
          currentResolver.tokenId,
        );
        if (result) {
          afterSetDefaultSuccess();
          handleClose();
          showToastSuccess({ message: 'Succeeded' });
        }
      } catch (error) {
        showToastError({
          message: (error as Error)?.message,
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const tableData = useMemo(() => {
    return dataInfinite?.map((item) => ({
      id: item?.id,
      render: {
        id: <span>#{item?.tokenId}</span>,
        bns: <span>{item?.name}</span>,
        avatar: (
          <div className="avatar">
            {item?.pfpData?.gcsUrl ? (
              <img
                src={item?.pfpData?.gcsUrl}
                width={28}
                height={28}
                alt={item?.pfpData?.filename}
              />
            ) : (
              <span>--</span>
            )}
          </div>
        ),
        action: (
          <div className="action">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="bns-default"
                checked={item?.tokenId === currentResolver?.tokenId}
                onChange={() => setCurrentResolver(item)}
              />
            </div>
          </div>
        ),
      },
    }));
  }, [dataInfinite, currentResolver]);

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
        <Title>Set default BNS</Title>

        <>
          {hasFirstFetching === false ? (
            <div className="loading">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              {dataInfinite && dataInfinite?.length > 0 && isEmpty === false ? (
                <InfiniteScroll
                  className="disable-scrollbar"
                  dataLength={dataInfinite.length}
                  next={loadMore}
                  hasMore={isReachingEnd === false}
                  height="50vh"
                  loader={
                    isLoadingMore && (
                      <div className="loading">
                        <Spinner variant="light" />
                      </div>
                    )
                  }
                >
                  <Table
                    tableHead={['#', 'BNS', 'AVATAR', 'DEFAULT']}
                    data={tableData}
                  />
                </InfiniteScroll>
              ) : (
                <div className="text-center">No data.</div>
              )}
            </>
          )}
        </>

        <Button
          onClick={updateDefaultBns}
          className="upload-btn"
          disabled={isProcessing}
        >
          <Text size="medium" fontWeight="medium" className="upload-text">
            {isProcessing ? 'Updating...' : 'Update'}
          </Text>
        </Button>
      </Modal.Body>
    </StyledModal>
  );
};

export default SetDefaultModal;
