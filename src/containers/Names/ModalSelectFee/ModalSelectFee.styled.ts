import { px2rem } from '@trustless-computer/dapp-core';
import styled from 'styled-components';
import { Modal } from 'react-bootstrap';

export const StyledModal = styled(Modal)`
  &.modal {
    --bs-modal-color: ${({ theme }) => theme.bg1};
    --bs-modal-width: ${px2rem(600)};
  }

  .modal-content {
    border-radius: 12px;
    background: #1c1c1c;
    box-shadow: -10px 0px 40px rgba(0, 0, 0, 0.2);
  }

  .modal-header {
    border-bottom: none;
    padding: 0;
    display: flex;
    justify-content: flex-end;
    padding-top: ${px2rem(18)};
    padding-right: ${px2rem(18)};
  }

  .modal-body {
    padding: ${px2rem(48)};
    padding-top: ${px2rem(0)};
  }

  .modal-footer {
    border-top: none;
  }

  .icon-close {
    cursor: pointer;
    svg {
      path {
        fill: #ffffff;
      }
    }
  }

  .estimated-fee {
    margin: ${px2rem(24)} 0;
    padding: ${px2rem(12)};
    background: #2e2e2e;
  }

  .upload-btn {
    width: 100%;
    padding: ${px2rem(11)} 0 ${px2rem(11)} 0;
    cursor: pointer;
    background: #8759f2;
    border-radius: 8px !important;

    .upload-text {
      font-weight: 600;
      font-size: ${px2rem(16)};
      line-height: 26px;
      letter-spacing: 0.01em;
    }
  }
`;

export const Title = styled.h6`
  font-weight: 600;
  font-size: ${px2rem(24)};
  line-height: 150%;
  letter-spacing: -0.03em;
  color: #ffffff;
`;
