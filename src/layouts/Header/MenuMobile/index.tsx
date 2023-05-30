import { AssetsContext } from '@/contexts/assets-context';
import { formatBTCPrice } from '@trustless-computer/dapp-core';
import { formatEthPrice } from '@/utils/format'
import React, { useContext } from 'react';
import { ConnectWalletButton, StyledLink, WalletBalance } from '../Header.styled';
import { Wrapper } from './MenuMobile.styled';
import { useSelector } from 'react-redux';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import { ROUTE_PATH } from '@/constants/route-path';
import { CDN_URL } from '@/configs';
import { useRouter } from 'next/router';

interface IProp {
  onCloseMenu: () => void;
  isOpen: boolean;
}

const MenuMobile = ({ onCloseMenu, isOpen }: IProp) => {
  const { btcBalance, tcBalance } = useContext(AssetsContext);
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const router = useRouter();

  const handleConnectWallet = async () => {
    router.push(`${ROUTE_PATH.CONNECT_WALLET}?next=${window.location.href}`);
  };

  return (
    <Wrapper className={isOpen ? 'show' : ''}>
      <div className="inner">
        <button className="btnMenuMobile" onClick={onCloseMenu}>
          <img src={`${CDN_URL}/icons/ic_close_menu.svg`} />
        </button>
        <StyledLink href={'https://trustless.computer/'} target="_blank">
          Trustless
        </StyledLink>
        <StyledLink href={'https://tcgasstation.com/'} target="_blank">
          Get TC
        </StyledLink>
        {isAuthenticated ? (
          <div className="wallet mobile">
            <WalletBalance>
              <div className="balance">
                <p>{formatBTCPrice(btcBalance)} BTC</p>
                <span className="divider"></span>
                <p>{formatEthPrice(tcBalance)} TC</p>
              </div>
              <div className="avatar">
                <img src={`${CDN_URL}/icons/ic-avatar.svg`} alt="default avatar" />
              </div>
            </WalletBalance>
          </div>
        ) : (
          <ConnectWalletButton onClick={handleConnectWallet}>Connect Wallet</ConnectWalletButton>
        )}
      </div>
    </Wrapper>
  );
};

MenuMobile.displayName = 'MenuMobile';
export default MenuMobile;
