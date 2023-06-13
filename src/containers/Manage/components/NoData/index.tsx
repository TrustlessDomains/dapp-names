import { memo } from 'react';
import Link from 'next/link';
import cn from 'classnames';

import { CDN_URL } from '@/configs';
import { ROUTE_PATH } from '@/constants/route-path';
import IconSVG from '@/components/IconSVG';
import { Container } from './NoData.styled';

const NoData = ({ className }: { className?: string }) => {
  return (
    <Container className={cn(className)}>
      <IconSVG
        src={`${CDN_URL}/icons/open-box.svg`}
        maxWidth="222"
        maxHeight="229"
      />
      <p className="text">
        You have no BNS.&nbsp;
        <Link className="link" href={ROUTE_PATH.HOME}>
          Register Now.
        </Link>
      </p>
    </Container>
  );
};

export default memo(NoData);
