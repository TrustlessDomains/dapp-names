import { MainModal } from '@/components/Modal/MainModal.styled';
import { px2rem } from '@trustless-computer/dapp-core';
import styled from 'styled-components';

export const StyledModalSelectFee = styled(MainModal)`
  .modal-content {
    border-radius: 8px !important;
  }

  .modal-title {
    font-size: ${px2rem(24)};
    line-height: 44px;
    color: ${({ theme }) => theme.primary.brand};
    text-align: center;
  }

  .est-fee {
    margin-top: ${px2rem(20)};
    margin-bottom: ${px2rem(28)};
  }

  .est-fee-options {
    display: flex;
    align-items: center;
    gap: ${px2rem(10)};
  }

  .est-fee-item {
    flex: 1;
    padding: ${px2rem(8)} ${px2rem(16)};
    border: 1px solid #cecece;
    border-radius: 8px;
    display: grid;
    place-items: center;
    text-align: center;
    opacity: 0.6;

    &.active {
      opacity: 1;
      border-color: #8759f2;
      border-width: 2px;
    }
  }

  .ext-price {
    color: #8759f2;
    font-size: ${px2rem(14)};
    span {
      font-size: ${px2rem(12)};
    }
  }

  .confirm-btn {
    width: 100%;
    padding-top: ${px2rem(12)};
    padding-bottom: ${px2rem(12)};
    border-radius: 8px !important;
    background-color: #8759f2;
  }
`;
