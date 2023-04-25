import px2rem from '@/utils/px2rem';
import styled from 'styled-components';
import { Tooltip } from 'react-bootstrap';

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${px2rem(8)};
  margin-top: ${px2rem(4)};
  font-family: var(--bs-body-font-family);

  .tooltip-name {
    font-size: ${px2rem(16)};
    line-height: ${px2rem(26)};
    color: white;

    font-weight: 400;
  }

  .penguin_icon {
    position: relative;

    svg,
    img {
      cursor: pointer;
      height: ${px2rem(20)};
      width: ${px2rem(20)};
    }

    &:hover {
      .penguin_content {
        opacity: 1;
        visibility: visible;
      }
    }
  }
`;

export const WrapTooltip = styled(Tooltip)`
  padding: ${px2rem(6)} 0;

  &_underline {
    text-decoration: underline;
    cursor: pointer;
  }

  .textLink {
    text-decoration: underline;
  }
`;
