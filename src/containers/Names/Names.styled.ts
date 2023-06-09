import px2rem from '@/utils/px2rem';
import styled, { DefaultTheme } from 'styled-components';

export const NamesContainer = styled.div`
  padding: ${px2rem(24)} ${px2rem(32)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.white};
  margin-top: ${px2rem(40)};
  flex-direction: column;

  .upload_left {
    display: flex;
    gap: ${px2rem(20)};
    align-items: center;
  }

  .upload_right {
    position: relative;
    overflow: hidden;
  }

  .upload_title {
    margin-bottom: ${px2rem(8)};
    text-align: center;
  }

  .upload_desc {
    font-weight: 400;
    font-size: ${px2rem(20)};
    line-height: ${px2rem(30)};
    margin-top: ${px2rem(16)};

    text-align: center;
    color: rgba(255, 255, 255, 0.8);
  }

  .wallet-link {
    display: flex;
  }
`;

export const FormContainer = styled.div`
  margin-top: ${px2rem(24)};

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: ${px2rem(8)};
  }

  .form {
    display: flex;
    justify-content: center;
    align-content: center;
    width: 100%;
  }

  .input {
    display: flex;
    justify-content: center;
    align-content: center;
    max-width: ${px2rem(702)};
    width: 100%;
    height: ${px2rem(60)};

    input {
      border: 1px solid #cecece;
      border-radius: 2px;
      padding: ${px2rem(19)} ${px2rem(24)};
      font-weight: 400;
      font-size: ${px2rem(16)};
      color: #ffffff;
      width: 100%;
    }
  }

  .btn {
    margin-left: ${px2rem(12)};
    padding: 0;
    height: ${px2rem(60)};

    button {
      height: 100%;
    }
  }

  @media screen and (max-width: 768px) {
    .form {
      display: block;
    }

    .btn {
      width: 100%;
      margin-top: ${px2rem(24)};
      margin-left: 0;

      button {
        width: 100%;
      }
    }
  }
`;
