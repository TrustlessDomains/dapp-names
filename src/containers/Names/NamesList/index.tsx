/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCollectionsBns } from '@/services/bns-explorer';
import { shortenAddress } from '@trustless-computer/dapp-core';
import { debounce } from 'lodash';
import { Spinner } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { Container } from './NamesList.styled';
import Jazzicon from 'react-jazzicon/dist/Jazzicon';
import { jsNumberForAddress } from 'react-jazzicon';

import useApiInfinite from '@/hooks/useApiInfinite';

const NameList = () => {
  const { dataInfinite, loadMore, isLoadingMore, isReachingEnd } =
    useApiInfinite(getCollectionsBns);

  const onLoadMoreNames = () => {
    loadMore();
  };

  const debounceLoadMore = debounce(onLoadMoreNames, 300);

  return (
    <Container>
      <div className="content">
        <InfiniteScroll
          className="list"
          dataLength={dataInfinite?.length || 500}
          hasMore={isReachingEnd === false}
          loader={
            isLoadingMore && (
              <div className="loading">
                <Spinner animation="border" variant="primary" />
              </div>
            )
          }
          next={debounceLoadMore}
        >
          <ResponsiveMasonry
            columnsCountBreakPoints={{
              350: 1,
              750: 2,
              900: 3,
              1240: 4,
              2500: 5,
              3000: 5,
            }}
          >
            <Masonry gutter="16px">
              {(dataInfinite &&
                dataInfinite.length > 0 &&
                dataInfinite.map((item: any, index: number) => {
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
                })) || <></>}
            </Masonry>
          </ResponsiveMasonry>
        </InfiniteScroll>
      </div>
    </Container>
  );
};

export default NameList;
