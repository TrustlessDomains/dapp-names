import { memo, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { useWeb3React } from '@web3-react/core';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';

import { IOwnedBNS } from '@/interfaces/bns';
import { getUserSelector } from '@/state/user/selector';
import { getBnsDefault } from '@/services/bns-explorer';
import Button from '@/components/Button';
import SetDefaultModal from '@/containers/Manage/components/SetDefaultModal';

import { Container } from './DefaultBns.styled';

const DefaultBns = ({ className }: { className?: string }) => {
  const { account = '' } = useWeb3React();
  const user = useSelector(getUserSelector);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [bnsDefault, setBnsDefault] = useState<IOwnedBNS | null>(null);

  const fetchBnsDefault = async () => {
    if (user?.walletAddress) {
      const result = await getBnsDefault(user?.walletAddress);
      if (result) {
        setBnsDefault(result);
      }
    }
  };

  useEffect(() => {
    fetchBnsDefault();
  }, [user?.walletAddress]);

  return (
    <Container className={cn(className, !bnsDefault && 'd-none')}>
      <div className="text">Your default BNS is:</div>
      <div className="list-default-bns">
        <div className="bns-info">
          {bnsDefault?.pfpData?.gcsUrl ? (
            <img
              src={bnsDefault?.pfpData?.gcsUrl}
              width={28}
              height={28}
              alt={bnsDefault?.name}
            />
          ) : (
            <Jazzicon diameter={28} seed={jsNumberForAddress(account)} />
          )}
          <div className="name">{bnsDefault?.name}</div>
        </div>
        <Button className="change-default-btn" onClick={() => setShowModal(true)}>
          Change the default
        </Button>
      </div>
      <SetDefaultModal
        showModal={showModal}
        setShowModal={setShowModal}
        bnsDefault={bnsDefault}
        afterSetDefaultSuccess={fetchBnsDefault}
      />
    </Container>
  );
};

export default memo(DefaultBns);
