import px2rem from '@/utils/px2rem';
import styled, { DefaultTheme } from 'styled-components';

export const StyledStepBlock = styled.div`
  &.block-wrapper {
    padding: ${px2rem(12)} ${px2rem(16)};
    color: #ffffff;
    background: rgba(75, 75, 75, 0.3);
    border-radius: 8px;
    margin-top: 0;
    margin-bottom: ${px2rem(24)};

    .title {
      margin-bottom: ${px2rem(12)};
      display: flex;
      align-items: center;
      text-transform: uppercase;
      color: #ffffff;
      font-size: ${px2rem(20)};
      line-height: 140%;
      font-weight: 400;

      @media screen and (max-width: ${({ theme }: { theme: DefaultTheme }) =>
          theme.breakpoint.sm}) {
        text-align: left;
      }
    }

    p {
      color: #ffffff;
      font-size: ${px2rem(12)};
      line-height: 140%;
      font-weight: 400;

      span {
        font-weight: 700;
      }
    }
  }
`;
