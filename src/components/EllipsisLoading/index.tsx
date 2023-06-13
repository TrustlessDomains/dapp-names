import React from 'react';
import { Wrapper } from './EllipsisLoading.styled';

const EllipsisLoading: React.FC = () => {
  return (
    <Wrapper>
      <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </Wrapper>
  )
}

export default EllipsisLoading;
