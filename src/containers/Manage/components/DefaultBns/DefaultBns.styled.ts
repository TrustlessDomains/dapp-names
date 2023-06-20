import styled, { DefaultTheme } from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Container = styled.div`
  margin: 0 auto;
  padding: ${px2rem(16)};
  max-width: ${px2rem(1000)};
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  background: #17171a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  color: #ffffff;

  .text {
    margin-bottom: ${px2rem(12)};
    font-weight: 400;
    font-size: ${px2rem(20)};
    line-height: 140%;
  }

  .list-default-bns {
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media screen and (max-width: ${({ theme }: { theme: DefaultTheme }) =>
        theme.breakpoint.xs}) {
      display: block;

      .bns-info {
        margin-bottom: ${px2rem(8)};
      }
    }

    .bns-info {
      display: flex;
      align-items: center;

      .name {
        margin-left: ${px2rem(8)};
        font-weight: 400;
        font-size: 16px;
        line-height: 140%;
      }
    }

    .change-default-btn {
      padding: ${px2rem(8)} ${px2rem(14)};
      font-weight: 600;
      font-size: ${px2rem(14)};
      line-height: ${px2rem(24)};
      letter-spacing: 0.01em;
      color: #ffffff;
      background: #8759f2;
      border-radius: 8px !important;
    }
  }
`;
