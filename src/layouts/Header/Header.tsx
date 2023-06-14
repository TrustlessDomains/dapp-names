import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

import { CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import { useWindowSize } from '@trustless-computer/dapp-core';
import IconSVG from '@/components/IconSVG';

import { Wrapper } from './Header.styled';
import MenuMobile from './MenuMobile';
import WalletHeader from './Wallet';

const Header = ({ height }: { height: number }) => {
  const refMenu = useRef<HTMLDivElement | null>(null);
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const { mobileScreen } = useWindowSize();

  useEffect(() => {
    if (refMenu.current) {
      if (isOpenMenu) {
        gsap.to(refMenu.current, { x: 0, duration: 0.6, ease: 'power3.inOut' });
      } else {
        gsap.to(refMenu.current, {
          x: '100%',
          duration: 0.6,
          ease: 'power3.inOut',
        });
      }
    }
  }, [isOpenMenu]);

  return (
    <Wrapper style={{ height }}>
      <div className="indicator" />
      <Link className="logo" href={ROUTE_PATH.HOME}>
        {!mobileScreen && (
          <img
            src={`${CDN_URL}/images/logo-names-2.svg`}
            alt="Trustless Market logo"
            width={183}
            height={40}
          />
        )}
        {mobileScreen && <img alt="logo" src={`${CDN_URL}/images/names-logo.svg`} />}
      </Link>
      <MenuMobile ref={refMenu} onCloseMenu={() => setIsOpenMenu(false)} />
      <div className="rightContainer">
        <div className="external-link">
          <Link href={'https://tcgasstation.com/'} target="_blank">
            Get TC
            <IconSVG
              maxWidth="28"
              src={`${CDN_URL}/pages/artifacts/icons/ic-link.svg`}
            ></IconSVG>
          </Link>
          <Link href={'https://newbitcoincity.com/'} target="_blank">
            NBC
            <IconSVG
              maxWidth="28"
              src={`${CDN_URL}/pages/artifacts/icons/ic-link.svg`}
            ></IconSVG>
          </Link>
          <Link href={'https://generative.xyz/discord'} target="_blank">
            Discord
            <IconSVG
              maxWidth="28"
              src={`${CDN_URL}/pages/artifacts/icons/ic-link.svg`}
            ></IconSVG>
          </Link>
        </div>
        <WalletHeader />
        <button className="btnMenuMobile" onClick={() => setIsOpenMenu(true)}>
          <img src={`${CDN_URL}/icons/ic_hambuger.svg`} />
        </button>
      </div>
    </Wrapper>
  );
};

export default Header;
