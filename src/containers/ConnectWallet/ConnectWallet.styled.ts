import styled from 'styled-components';
import px2rem from '@/utils/px2rem';
import { DefaultTheme } from 'styled-components';

export const Wrapper = styled.div`
  .header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-top: 27px;
    padding-bottom: 27px;

    .socialContainer {
      margin-left: ${px2rem(24)};
      display: flex;
      align-items: center;
      gap: ${px2rem(12)};
    }
  }

  .mainContent {
    min-height: calc(100vh - 82px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .logo {
      margin-bottom: ${px2rem(36)};
    }

    .title {
      max-width: 600px;
      font-weight: 600;
      font-size: ${px2rem(32)};
      line-height: ${px2rem(42)};
      color: #fff;
      text-align: center;
      margin-bottom: ${px2rem(12)};
    }

    .desc {
      max-width: 600px;
      font-weight: 500;
      font-size: ${px2rem(18)};
      line-height: ${px2rem(28)};
      color: #cecece;
      text-align: center;
      margin-bottom: ${px2rem(36)};
    }
  }
`;

export const ConnectWalletButton = styled.button`
  background: ${({ theme }) => theme.btnBg};
  color: ${({ theme }: { theme: DefaultTheme }) => theme.text1};

  padding: ${px2rem(15)} ${px2rem(24)};
  /* color: #fff; */
  font-size: ${px2rem(16)};
  line-height: ${px2rem(26)};
  font-weight: 400;
  border-radius: 2px;
  position: relative;

  :disabled {
    opacity: 0.8;
  }
`;
