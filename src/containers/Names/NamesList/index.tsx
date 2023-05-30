/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCollectionsBns } from '@/services/bns-explorer';
import { shortenAddress } from '@trustless-computer/dapp-core';
import { debounce } from 'lodash';
import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Container, NameListLayout } from './NamesList.styled';
import Jazzicon from 'react-jazzicon/dist/Jazzicon';
import { jsNumberForAddress } from 'react-jazzicon';

const LIMIT_PAGE = 48;

const NameList = () => {
  const [pageSize] = useState(LIMIT_PAGE);
  const [isFetching, setIsFetching] = useState(false);
  const [collections, setCollections] = useState<any>();

  const fetchNames = async (page = 1, isFetchMore = false) => {
    try {
      setIsFetching(true);
      const data = await getCollectionsBns({ limit: pageSize, page: page });
      if (isFetchMore) {
        setCollections((prev: any) => [...prev, ...data]);
      } else {
        setCollections(data);
      }
    } catch (error) {
    } finally {
      setIsFetching(false);
    }
  };

  const onLoadMoreNames = () => {
    if (isFetching || collections?.length % LIMIT_PAGE !== 0) return;
    const page = Math.floor(collections.length / LIMIT_PAGE) + 1;
    fetchNames(page, true);
  };
  const debounceLoadMore = debounce(onLoadMoreNames, 300);

  useEffect(() => {
    fetchNames();
  }, []);

  return (
    <Container>
      <div className="content">
        <InfiniteScroll
          className="list"
          dataLength={collections?.length || 500}
          hasMore={true}
          loader={
            isFetching && (
              <div className="loading">
                <Spinner animation="border" variant="primary" />
              </div>
            )
          }
          next={debounceLoadMore}
        >
          <NameListLayout>
            {collections &&
              collections.length > 0 &&
              collections.map((item: any, index: number) => {
                return (
                  <div key={index.toString()} className="card">
                    <div className="card-content">
                      <div className="card-info">
                        <p className="card-title">{item.name}</p>
                        <div className="flex-between">
                          <div className="card-owner">
                            <Jazzicon
                              diameter={24}
                              seed={jsNumberForAddress(item.owner)}
                            ></Jazzicon>
                            <p className="card-subTitle">
                              {shortenAddress(item.owner, 4)}
                            </p>
                          </div>
                          <p className="card-subTitle">Name #{item.id}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </NameListLayout>
        </InfiniteScroll>
      </div>
    </Container>
  );
};

export default NameList;
