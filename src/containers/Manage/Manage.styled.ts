import styled, { DefaultTheme } from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;

  .title {
    margin-top: ${px2rem(32)};
    font-weight: 400;
    font-size: 48px;
    line-height: 58px;
    text-align: center;
    letter-spacing: -0.05em;
    color: ${({ theme }: { theme: DefaultTheme }) => theme.white};
  }

  .loading {
    margin-top: ${px2rem(48)};
    display: flex;
    justify-content: center;
  }

  .mt-60 {
    margin-top: ${px2rem(60)};
  }

  .list-domains {
    margin-top: ${px2rem(48)};
    padding: ${px2rem(32)};
    background: #1b1e26;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;

    .table {
      margin-bottom: 0;

      .tableData {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .tableHead_item {
        padding: ${px2rem(12)} ${px2rem(16)};
        color: ${({ theme }: { theme: DefaultTheme }) => theme.white};
        font-weight: 600;
        font-size: 12px;
        line-height: 22px;
      }

      .tableData_item {
        padding: ${px2rem(32)} ${px2rem(16)};
        color: ${({ theme }: { theme: DefaultTheme }) => theme.white};
        font-weight: 600;
        font-size: 16px;
        line-height: 28px;
        letter-spacing: -0.01em;

        .address,
        .avatar {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
        }
        .edit-icon {
          cursor: pointer;
        }
        .resolver {
          display: flex;
          cursor: pointer;
          p {
            margin-right: ${px2rem(8)};
          }
        }
      }
    }

    .tableHead {
      background: #000000;
    }
  }
`;
