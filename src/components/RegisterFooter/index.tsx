import cn from 'classnames';

import RegisterForm from '@/components/BNS/RegisterForm';

import { StyledRegisterFooter } from './RegisterFooter.styled';

type Props = {
  className?: string;
  style?: React.CSSProperties;
  isVisible: boolean;
};

const RegisterFooter = ({ className, isVisible, style }: Props) => {
  return (
    <StyledRegisterFooter
      className={cn(className)}
      isVisible={isVisible}
      style={style}
    >
      <RegisterForm />
    </StyledRegisterFooter>
  );
};

export default RegisterFooter;
