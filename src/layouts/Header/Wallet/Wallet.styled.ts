import px2rem from '@/utils/px2rem';
import { Popover } from 'react-bootstrap';
import styled from 'styled-components';

export const WalletPopover = styled(Popover)`
  background-color: #17171a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  width: ${px2rem(200)};
  color: ${({ theme }) => theme.white};
  padding: ${px2rem(12)} ${px2rem(20)};

  .icCopy {
    cursor: pointer;
  }

  .wallet-tc,
  .wallet-btc {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: ${px2rem(16)};
  }

  .wallet-item {
    display: flex;
    align-items: center;
    gap: ${px2rem(8)};
  }

  .wallet-link,
  .wallet-disconnect {
    display: flex;
    align-items: center;
    gap: ${px2rem(12)};
    cursor: pointer;
    :hover {
      opacity: 0.6;
    }
  }

  .wallet-link {
    margin-top: ${px2rem(20)};
    margin-bottom: ${px2rem(20)};
  }

  .divider {
    margin-bottom: ${px2rem(16)};
  }

  &.popover {
    /* display: none; */

    .popover-arrow {
      width: 100%;
      transform: translate(0px, 0px) !important;
    }

    .popover-arrow::after {
      width: 100%;
      border-bottom-color: transparent !important;
    }
  }
`;
