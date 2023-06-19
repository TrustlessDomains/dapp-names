import styled from 'styled-components';
import px2rem from '@/utils/px2rem';
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

  .loading {
    margin: ${px2rem(48)} 0;
    display: flex;
    justify-content: center;
  }

  .table {
    margin-bottom: ${px2rem(24)};

    .tableData {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .tableHead_item {
      padding: ${px2rem(12)} ${px2rem(16)};
      background: #000000;
    }

    .tableData_item {
      padding: ${px2rem(10)} ${px2rem(16)};
    }

    .avatar,
    .default {
      text-align: center;
    }

    .action {
      display: flex;
      justify-content: center;
      align-items: center;
      input {
        cursor: pointer;
      }
      .form-check-input:checked {
        background-color: #8759f2;
        border-color: #8759f2;
      }
    }
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
  margin-bottom: ${px2rem(24)};
  font-weight: 600;
  font-size: ${px2rem(24)};
  line-height: 150%;
  letter-spacing: -0.03em;
  color: #ffffff;
`;
