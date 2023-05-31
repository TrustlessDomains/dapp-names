import { CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import Link from 'next/link';
import { useState } from 'react';
import { Wrapper } from './Header.styled';
import MenuMobile from './MenuMobile';
import WalletHeader from './Wallet';
import { useWindowSize } from '@trustless-computer/dapp-core';

const Header = ({ height }: { height: number }) => {
  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false);
  const { mobileScreen } = useWindowSize();

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
      <MenuMobile isOpen={isOpenMenu} onCloseMenu={() => setIsOpenMenu(false)} />
      <div className="rightContainer">
        <div className="external-link">
          <Link href={'https://trustless.computer/'} target="_blank">
            Trustless
          </Link>
          <Link href={'https://tcgasstation.com/'} target="_blank">
            Get TC
          </Link>
        </div>
        <WalletHeader />
        <button className="btnMenuMobile" onClick={() => setIsOpenMenu(true)}>
          <img src={`${CDN_URL}/icons/ic_hambuger.svg`} alt='ic_hambuger' />
        </button>
      </div>
    </Wrapper>
  );
};

export default Header;
