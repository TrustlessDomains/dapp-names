import Button from '@/components/Button';
import { getUserSelector } from '@/state/user/selector';
import { shortenAddress } from '@trustless-computer/dapp-core';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import BNSTransferModal from '../TransferModal';
import { StyledBNSCard } from './BNSCard.styled';
import Jazzicon from 'react-jazzicon/dist/Jazzicon';
import { jsNumberForAddress } from 'react-jazzicon';

type Props = {
  item: {
    name: string;
    owner: string;
    id: number;
  };
};

const BNSCard = ({ item }: Props) => {
  const user = useSelector(getUserSelector);
  const [showModal, setShowModal] = useState(false);

  const isAllowTransfer = useMemo(
    () => item.owner === user?.walletAddress,
    [item.owner, user?.walletAddress],
  );

  return (
    <>
      <StyledBNSCard className="card">
        <div className="card-content">
          <div className="card-info">
            <p className="card-title">{item.name}</p>

            <div className="flex-between">
              <div className="card-owner">
                <Jazzicon
                  diameter={28}
                  seed={jsNumberForAddress(item.owner)}
                ></Jazzicon>
                <p className="card-subTitle">{shortenAddress(item.owner, 4)}</p>
              </div>
              <p className="card-subTitle">Name #{item.id}</p>
            </div>
            {isAllowTransfer && (
              <Button
                bg="white"
                className="transfer-btn"
                onClick={() => setShowModal(true)}
              >
                Transfer
              </Button>
            )}
          </div>
        </div>
      </StyledBNSCard>
      <BNSTransferModal
        name={item.name}
        show={showModal}
        handleClose={() => setShowModal(false)}
      ></BNSTransferModal>
    </>
  );
};

export default BNSCard;
