import { useState } from 'react';
import cn from 'classnames';
import { Formik } from 'formik';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import useIsRegistered, {
  ICheckIfRegisteredNameParams,
} from '@/hooks/contract-operations/bns/useIsRegistered';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { showToastError } from '@/utils/toast';
import { ROUTE_PATH } from '@/constants/route-path';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import Text from '@/components/Text';
import ModalSelectFee from '@/containers/Names/ModalSelectFee';

import { StyledRegisterForm, SubmitButton } from './RegisterForm.styled';

type IFormValue = {
  registerText: string;
};

const RegisterForm = ({ className }: { className?: string }) => {
  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const router = useRouter();

  const { run: checkNameIsRegistered } = useContractOperation<
    ICheckIfRegisteredNameParams,
    boolean
  >({
    operation: useIsRegistered,
    inscribeable: false,
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [registerText, setRegisterText] = useState<string>('');

  const handleCheckNameIsRegistered = async () => {
    try {
      setIsProcessing(true);
      const isRegistered = await checkNameIsRegistered({
        name: registerText,
      });

      // If name has already been taken
      if (isRegistered) {
        showToastError({
          message: `${registerText} has already been taken. Please choose another one or buy on secondary`,
          url: 'https://trustlessnfts.com/collection/0x8b46f89bba2b1c1f9ee196f43939476e79579798',
          linkText: 'here',
        });
      }
      return isRegistered;
    } catch (err: unknown) {
      throw Error();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      router.push(ROUTE_PATH.CONNECT_WALLET);
      return;
    }

    const nameRegistered = await handleCheckNameIsRegistered();
    if (!nameRegistered) {
      setShowModal(true);
    }
  };

  const validateForm = (values: IFormValue): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!values?.registerText) {
      errors.registerText = 'Address is required.';
    }
    return errors;
  };

  return (
    <>
      <StyledRegisterForm className={cn(className)}>
        <Formik
          initialValues={{
            registerText,
          }}
          validate={validateForm}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, handleChange }) => (
            <form onSubmit={handleSubmit} className="register-form">
              <input
                className="input"
                name="registerText"
                type="text"
                placeholder="Enter name, address"
                onChange={(e) => {
                  setRegisterText(e.target.value);
                  handleChange(e);
                }}
              />

              <SubmitButton
                type="submit"
                bg="btnBg"
                disabled={!registerText || isProcessing}
              >
                <Text
                  size="medium"
                  color="bg1"
                  className="button-text"
                  fontWeight="medium"
                >
                  {isProcessing ? 'Processing...' : 'Register'}
                </Text>
              </SubmitButton>
            </form>
          )}
        </Formik>
      </StyledRegisterForm>
      <ModalSelectFee
        show={showModal}
        handleClose={() => setShowModal(false)}
        valueInput={registerText}
        setValueInput={setRegisterText}
      />
    </>
  );
};

export default RegisterForm;
