import { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Spinner } from 'react-bootstrap';
import copy from 'copy-to-clipboard';
import { toast } from 'react-hot-toast';

import withConnectedWallet from '@/hoc/withConnectedWallet';
import { IOwnedBNS } from '@/interfaces/bns';
import { getBnsByWallet } from '@/services/bns-explorer';
import { FETCH_LIMIT, CDN_URL } from '@/configs';
import logger from '@/services/logger';
import { getUserSelector } from '@/state/user/selector';
import { formatLongAddress } from '@trustless-computer/dapp-core';
import Table from '@/components/Table';
import IconSVG from '@/components/IconSVG';
import Text from '@/components/Text';

import LinkAddressModal from './components/LinkAddressModal';
import LinkAvatarModal from './components/LinkAvatarModal';
import NoData from './components/NoData';
import DefaultBns from './components/DefaultBns';
import { Container } from './Manage.styled';

const Manage = () => {
  const user = useSelector(getUserSelector);
  const [hasFetching, setHasFetching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [yourListDomains, setYourListDomains] = useState<IOwnedBNS[]>([]);
  const [showModalAddress, setShowModalAddress] = useState<boolean>(false);
  const [showModalAvatar, setShowModalAvatar] = useState<boolean>(false);
  const [domainSelecting, setDomainSelecting] = useState<IOwnedBNS | null>(null);

  const fetchListDomains = async (p?: number): Promise<void> => {
    if (!user?.walletAddress) {
      return;
    }

    try {
      setLoading(true);
      const page = p || Math.floor(yourListDomains.length / FETCH_LIMIT) + 1;
      const res = await getBnsByWallet({
        page,
        limit: FETCH_LIMIT,
        walletAddress: user.walletAddress,
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
      setHasFetching(true);
    }
  };

  useEffect(() => {
    fetchListDomains();
  }, [user?.walletAddress]);

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
    return yourListDomains?.map((item) => ({
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
  }, [yourListDomains]);

  return (
    <Container>
      <h1 className="title">Manage your BNS</h1>
      <DefaultBns className="mb-48" />
      {hasFetching ? (
        <>
          {yourListDomains.length > 0 ? (
            <InfiniteScroll
              className="disable-scrollbar"
              dataLength={yourListDomains.length}
              next={fetchListDomains}
              hasMore={hasMore}
              height="80vh"
              style={{ overflow: 'hidden auto' }}
              loader={
                loading ? (
                  <div className="loading">
                    <Spinner variant="light" />
                  </div>
                ) : (
                  <></>
                )
              }
            >
              <div className="list-domains">
                <Table
                  classWrapper="table-responsive"
                  tableHead={['#', 'BNS', 'AVATAR', 'ADDRESS']}
                  data={tableData}
                />
              </div>
            </InfiniteScroll>
          ) : (
            <NoData className="mt-60" />
          )}
        </>
      ) : (
        <div className="loading">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
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
