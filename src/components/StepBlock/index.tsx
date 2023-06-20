import React, { PropsWithChildren } from 'react';

import { StyledStepBlock } from './StepBlock.styled';

type Props = {
  title?: string;
  text?: string;
};

const StepBlock = ({ title = 'Big File', children }: PropsWithChildren<Props>) => {
  return (
    <StyledStepBlock className="block-wrapper">
      <div className="title">{title}</div>
      {children}
    </StyledStepBlock>
  );
};

export default StepBlock;
