import Image from 'next/image';
import { MENU_HEADER } from '@/constants/header';
import { AssetsContext } from '@/contexts/assets-context';
import { formatBTCPrice } from '@trustless-computer/dapp-core';
import { formatEthPrice } from '@/utils/format';
import React, { ForwardedRef, useContext } from 'react';
import { ConnectWalletButton, StyledLink, WalletBalance } from '../Header.styled';
import { Wrapper } from './MenuMobile.styled';
import { useSelector } from 'react-redux';
import { getIsAuthenticatedSelector, getUserSelector } from '@/state/user/selector';
import { ROUTE_PATH } from '@/constants/route-path';
import { CDN_URL } from '@/configs';
import { useRouter } from 'next/router';

interface IProp {
  onCloseMenu: () => void;
}

const MenuMobile = React.forwardRef(
  ({ onCloseMenu }: IProp, ref: ForwardedRef<HTMLDivElement>) => {
    const { btcBalance, juiceBalance } = useContext(AssetsContext);
    const isAuthenticated = useSelector(getIsAuthenticatedSelector);
    const router = useRouter();
    const user = useSelector(getUserSelector);

    const activePath = router.pathname.split('/')[1];

    const handleConnectWallet = async () => {
      router.push(`${ROUTE_PATH.CONNECT_WALLET}?next=${window.location.href}`);
    };

    return (
      <Wrapper ref={ref}>
        <div className="inner">
          <button className="btnMenuMobile" onClick={onCloseMenu}>
            <Image
              width="24"
              height="24"
              src={`${CDN_URL}/icons/ic_close_menu.svg`}
              alt="close"
            />
          </button>
          <StyledLink
            $active={false}
            href={'https://tcgasstation.com/'}
            target="_blank"
          >
            Get TC
          </StyledLink>
          <StyledLink
            $active={false}
            href={'https://newbitcoincity.com/'}
            target="_blank"
          >
            NBC
          </StyledLink>
          <StyledLink
            $active={false}
            href={'https://generative.xyz/discord/'}
            target="_blank"
          >
            Discord
          </StyledLink>
          {MENU_HEADER.map((item) => {
            return (
              <StyledLink
                $active={activePath === item.activePath}
                href={item.route}
                key={item.id}
                onClick={onCloseMenu}
                $activeColor="#F9D03F"
              >
                {item.name}
              </StyledLink>
            );
          })}
          {isAuthenticated ? (
            <div className="wallet mobile">
              <WalletBalance>
                <div className="balance">
                  <p>{formatBTCPrice(btcBalance)} BTC</p>
                  <span className="divider"></span>
                  <p>{formatEthPrice(juiceBalance)} TC</p>
                </div>
                <div className="avatar">
                  {user?.avatar ? (
                    <Image width="32" height="32" src={user?.avatar} alt="avatar" />
                  ) : (
                    <Image
                      width="32"
                      height="32"
                      src={`${CDN_URL}/icons/ic-avatar.svg`}
                      alt="default avatar"
                    />
                  )}
                </div>
              </WalletBalance>
            </div>
          ) : (
            <ConnectWalletButton onClick={handleConnectWallet}>
              Connect Wallet
            </ConnectWalletButton>
          )}
        </div>
      </Wrapper>
    );
  },
);

MenuMobile.displayName = 'MenuMobile';
export default MenuMobile;
