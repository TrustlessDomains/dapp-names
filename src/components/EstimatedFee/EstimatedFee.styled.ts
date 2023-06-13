import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const Wrapper = styled.div`
  padding: ${px2rem(16)} ${px2rem(28)};
  background: rgba(0, 46, 29, 0.6);
  border-radius: 8px;

  .est-fee-item {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:not(:last-child) {
      margin-bottom: ${px2rem(4)};
    }
  }

  .est-fee-title {
    margin-bottom: ${px2rem(4)};
    font-weight: 600;
    font-size: ${px2rem(14)};
    line-height: 1.4;
    color: #fff;
  }

  .est-fee-item-title {
    font-weight: 400;
    font-size: ${px2rem(12)};
    line-height: 1.5;
    color: #fff;
    letter-spacing: -0.01em;
  }

  .est-fee-item-value {
    font-weight: 600;
    font-size: ${px2rem(12)};
    line-height: 1.5;
    letter-spacing: -0.01em;
    color: #fff;
  }
`;
