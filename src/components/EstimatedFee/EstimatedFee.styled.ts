import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: ${px2rem(16)} ${px2rem(28)};
  background: rgba(0, 46, 29, 0.6);
  border-radius: 16px;

  .est-fee-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: ${px2rem(12)};
    }
  }

  .est-fee-title {
    font-weight: 500;
    font-size: ${px2rem(16)};
    line-height: 1.4;
    color: #fff;
    text-transform: uppercase;
    margin-bottom: ${px2rem(20)};
    letter-spacing: 0.08em;
  }

  .est-fee-item-title {
    font-weight: 400;
    font-size: ${px2rem(16)};
    line-height: 1.2;
    color: #fff;
  }

  .est-fee-item-value {
    font-weight: 500;
    font-size: ${px2rem(16)};
    line-height: 1.2;
    color: #fff;
  }
`;
