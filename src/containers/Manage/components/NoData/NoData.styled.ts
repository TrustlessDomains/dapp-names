import styled, { DefaultTheme } from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${px2rem(80)} 0;
  background: #1b1e26;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: ${px2rem(20)};

  .text {
    margin-top: ${px2rem(48)};
    font-weight: 400;
    font-size: 24px;
    line-height: 150%;
    letter-spacing: -0.05em;
    color: ${({ theme }: { theme: DefaultTheme }) => theme.white};

    a {
      border-bottom: 1px solid #b09be3;
      border-bottom-width: thin;
      font-weight: 600;
      color: #c6adff;
      &:hover {
        text-decoration: none;
      }
    }
  }
`;
