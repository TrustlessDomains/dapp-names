import copy from 'copy-to-clipboard';
import { useMemo, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSelector } from 'react-redux';

import { CDN_URL } from '@/configs';
import withConnectedWallet from '@/hoc/withConnectedWallet';
import { IOwnedBNS } from '@/interfaces/bns';
import { getBnsByWallet } from '@/services/bns-explorer';
import IconSVG from '@/components/IconSVG';
import Table from '@/components/Table';
import Text from '@/components/Text';
import useApiInfinite from '@/hooks/useApiInfinite';
import { getUserSelector } from '@/state/user/selector';
import { formatLongAddress } from '@trustless-computer/dapp-core';

import { Container } from './Manage.styled';
import DefaultBns from './components/DefaultBns';
import LinkAddressModal from './components/LinkAddressModal';
import LinkAvatarModal from './components/LinkAvatarModal';
import NoData from './components/NoData';

const Manage = () => {
  const user = useSelector(getUserSelector);
  const [showModalAddress, setShowModalAddress] = useState<boolean>(false);
  const [showModalAvatar, setShowModalAvatar] = useState<boolean>(false);
  const [domainSelecting, setDomainSelecting] = useState<IOwnedBNS | null>(null);

  const {
    dataInfinite,
    loadMore,
    isLoadingMore,
    isReachingEnd,
    isEmpty,
    hasFirstFetching,
  } = useApiInfinite(
    getBnsByWallet,
    {
      walletAddress: user?.walletAddress,
    },
    { shouldFetch: !!user?.walletAddress },
  );

  const handleMapDomainToAddress = (domain: IOwnedBNS): void => {
    setDomainSelecting(domain);
    setShowModalAddress(true);
  };

  const handleSetDomainToAvatar = (domain: IOwnedBNS): void => {
    setDomainSelecting(domain);
    setShowModalAvatar(true);
  };

  const onClickCopy = (address: string) => {
    copy(address);
    toast.success('Copied');
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
                width={34}
                height={34}
                alt={item?.pfpData?.filename}
              />
            ) : (
              <span>--</span>
            )}
            <IconSVG
              className="edit-icon"
              onClick={() => handleSetDomainToAvatar(item)}
              src={`${CDN_URL}/icons/pencil.svg`}
              maxWidth="24"
              maxHeight="24"
            />
          </div>
        ),
        address: (
          <div className="address">
            {item?.resolver ? (
              <div className="resolver" onClick={() => onClickCopy(item.resolver)}>
                <Text size="regular" fontWeight="regular">
                  {formatLongAddress(item.resolver)}
                </Text>
                <IconSVG
                  src={`${CDN_URL}/icons/ic-copy.svg`}
                  color="white"
                  maxWidth="20"
                  maxHeight="20"
                />
              </div>
            ) : (
              <span>--</span>
            )}
            <IconSVG
              className="edit-icon"
              onClick={() => handleMapDomainToAddress(item)}
              src={`${CDN_URL}/icons/pencil.svg`}
              maxWidth="24"
              maxHeight="24"
            />
          </div>
        ),
      },
    }));
  }, [dataInfinite]);

  return (
    <Container>
      <h1 className="title">Manage your BNS</h1>
      <DefaultBns className="mb-48" />
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
                height="80vh"
                loader={
                  isLoadingMore && (
                    <div className="loading">
                      <Spinner variant="light" />
                    </div>
                  )
                }
              >
                <div className="list-domains">
                  <Table
                    tableHead={['#', 'BNS', 'AVATAR', 'ADDRESS']}
                    data={tableData}
                  />
                </div>
              </InfiniteScroll>
            ) : (
              <NoData className="mt-60" />
            )}
          </>
        )}
      </>

      <LinkAddressModal
        showModal={showModalAddress}
        setShowModal={setShowModalAddress}
        domainSelecting={domainSelecting}
      />
      <LinkAvatarModal
        showModal={showModalAvatar}
        setShowModal={setShowModalAvatar}
        domainSelecting={domainSelecting}
      />
    </Container>
  );
};

export default withConnectedWallet(Manage);
