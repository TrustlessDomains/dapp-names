import { px2rem } from '@trustless-computer/dapp-core';
import styled, { DefaultTheme } from 'styled-components';

export const StyledRegisterFooter = styled.div<{ isVisible: boolean }>`
  width: 100%;
  padding: ${px2rem(12)} 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background: #2e2e2e;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.12);
  position: fixed;
  left: 0;
  bottom: 0;
  gap: ${px2rem(20)};
  z-index: 999;
  transition: all 0.3s ease-in-out;

  transform: ${({ isVisible }) =>
    isVisible ? 'translateY(100%)' : 'translateY(100)'};

  --translate-icon: 23%;

  .register-form {
    display: flex;

    .input {
      width: ${px2rem(600)};
      padding: ${px2rem(12)} ${px2rem(20)};
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 8px;
      color: #ffffff;

      @media screen and (max-width: ${({ theme }: { theme: DefaultTheme }) =>
          theme.breakpoint.md}) {
        width: ${px2rem(300)};
      }

      @media screen and (max-width: ${({ theme }: { theme: DefaultTheme }) =>
          theme.breakpoint.xs}) {
        width: ${px2rem(200)};
      }
    }
  }
`;
