import { px2rem } from '@trustless-computer/dapp-core';
import styled, { DefaultTheme } from 'styled-components';

import Button from '@/components/Button';

export const StyledRegisterForm = styled.div`
  width: 100%;
  padding: ${px2rem(12)} 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

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

export const SubmitButton = styled(Button)`
  width: ${px2rem(180)};
  margin-left: ${px2rem(12)};
  padding: ${px2rem(12)} ${px2rem(57.5)};
  border-radius: 8px !important;
  p {
    padding: unset !important;
    color: ${({ theme }: { theme: DefaultTheme }) => theme.text1};
  }

  :disabled {
    opacity: 0.5;
  }

  @media screen and (max-width: ${({ theme }: { theme: DefaultTheme }) =>
      theme.breakpoint.xs}) {
    width: ${px2rem(100)};
    padding: ${px2rem(12)};
  }
`;
