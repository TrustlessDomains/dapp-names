import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledInsufficientFund = styled.div`
  margin-top: ${px2rem(28)};
  display: flex;
  flex-direction: column;
  gap: ${px2rem(16)};

  .noti-item {
    display: flex;
    align-items: center;
    gap: ${px2rem(8)};
    padding: ${px2rem(8)} ${px2rem(12)};
    border: 1px solid #f9d03f;
    border-radius: 8px;

    p {
      color: #fcba03;
    }
  }

  .text-underline {
    text-decoration: underline;
  }

  .mt-0 {
    margin-top: 0;
  }
`;
