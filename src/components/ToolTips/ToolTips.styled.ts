import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${px2rem(8)};
  margin-top: ${px2rem(4)};

  .tooltip-name {
    font-size: ${px2rem(18)};
    line-height: ${px2rem(28)};
    color: white;

    font-weight: 400;
  }

  .penguin_icon {
    position: relative;

    svg,
    img {
      cursor: pointer;
      height: ${px2rem(20)};
      width: ${px2rem(20)};
    }

    &:hover {
      .penguin_content {
        opacity: 1;
        visibility: visible;
      }
    }
  }
  .penguin_icon_tooltip {
  }
`;

export const WrapTooltip = styled.div`
  max-width: ${px2rem(300)};
  background: red;
  background-color: red;

  background-color: #17171a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: ${({ theme }) => theme.white};
  padding: ${px2rem(12)} ${px2rem(20)};
  margin-top: ${px2rem(8)};

  &_underline {
    text-decoration: underline;
    cursor: pointer;
  }

  .textLink {
    text-decoration: underline;
  }

  .transactionID {
    color: white;
    font-weight: 800;
  }
`;
