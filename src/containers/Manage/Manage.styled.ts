import styled, { DefaultTheme } from 'styled-components';
import px2rem from '@/utils/px2rem';

export const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;

  .title {
    margin: ${px2rem(32)} 0 ${px2rem(60)} 0;
    font-weight: 400;
    font-size: ${px2rem(48)};
    line-height: 58px;
    text-align: center;
    letter-spacing: -0.05em;
    color: ${({ theme }: { theme: DefaultTheme }) => theme.white};

    @media screen and (max-width: ${({ theme }: { theme: DefaultTheme }) =>
        theme.breakpoint.md}) {
      font-size: ${px2rem(34.66)};
    }
  }

  .mb-48 {
    margin-bottom: ${px2rem(48)};
  }

  .loading {
    margin-top: ${px2rem(48)};
    display: flex;
    justify-content: center;
  }

  .noData {
    max-width: ${px2rem(1410)};
    width: inherit;
    margin: 0 auto;
  }

  .list-domains {
    max-width: ${px2rem(1000)};
    margin: 0 auto;
    padding: ${px2rem(32)};
    background: #1b1e26;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;

    .table {
      margin-bottom: 0;

      .tableData {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }

      .bns {
        width: 40%;
      }

      .tableHead_item {
        padding: ${px2rem(12)} ${px2rem(16)};
        background: #000000;
        color: ${({ theme }: { theme: DefaultTheme }) => theme.white};
        font-weight: 600;
        font-size: ${px2rem(12)};
        line-height: 22px;
      }

      .tableData_item {
        padding: ${px2rem(32)} ${px2rem(24)};
        color: ${({ theme }: { theme: DefaultTheme }) => theme.white};
        font-weight: 600;
        font-size: ${px2rem(16)};
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
            font-weight: 600;
            font-size: ${px2rem(16)};
            line-height: inherit;
            letter-spacing: -0.01em;
          }
        }
      }
    }
  }
`;
