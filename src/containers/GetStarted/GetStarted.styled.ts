import px2rem from '@/utils/px2rem';
import styled from 'styled-components';

export const StyledGetStarted = styled.div`
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  color: #fff;
  padding-bottom: ${px2rem(40)};

  .wrapper {
    margin-top: ${px2rem(60)};
    display: flex;
    flex-direction: column;
  }

  .title {
    margin-bottom: ${px2rem(60)};
    font-weight: 700;
    font-size: ${px2rem(48)};
    line-height: ${px2rem(52)};
    color: #ffffff;
    text-align: center;
  }

  .normal-link {
    text-transform: none;
  }

  h3 {
    word-wrap: break-word;
  &:hover {
    .anchor {
      visibility: visible;
    }
  }

  .anchor {
    visibility: hidden;
  }
`;

export const StepBlock = styled.div`
  margin-bottom: ${px2rem(60)};
  padding: ${px2rem(24)};
  background: #1b1e26;
  border: 1px solid #c6c7f8;
  border-radius: 20px;
  width: 100%;
  transition: all 0.3s ease-in-out;
  opacity: 1;

  &:last-child {
    margin-bottom: 0;
  }

  .content-wrapper {
    display: flex;
    flex-direction: column;
  }

  .content-wrapper-item {
    margin-bottom: ${px2rem(48)};
    &:last-child {
      margin-bottom: 0;
    }
  }

  h3 {
    margin-bottom: ${px2rem(24)};
    font-weight: 700;
    font-size: ${px2rem(24)};
    line-height: 150%;
    text-transform: uppercase;
  }

  .image-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: ${px2rem(700)};

      @media screen and (max-width: 500px) {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
`;
