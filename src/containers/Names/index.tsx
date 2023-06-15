import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

import { ROUTE_PATH } from '@/constants/route-path';
import useIsRegistered, {
  ICheckIfRegisteredNameParams,
} from '@/hooks/contract-operations/bns/useIsRegistered';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import { getIsAuthenticatedSelector } from '@/state/user/selector';
import { showToastError } from '@/utils/toast';
import { useIsInViewport } from '@/hooks/useIsInViewport';
import Text from '@/components/Text';
import ToolTips from '@/components/ToolTips';
import RegisterFooter from '@/components/RegisterFooter';

import ModalSelectFee from './ModalSelectFee';
import NamesList from './NamesList';
import { FormContainer, NamesContainer, SubmitButton } from './Names.styled';

const Names: React.FC = () => {
  const [nameValidate, setNameValidate] = useState(false);
  const [valueInput, setValueInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const registerInputRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = useSelector(getIsAuthenticatedSelector);
  const router = useRouter();
  const showRegisterFooter = useIsInViewport(registerInputRef, {
    threshold: 0.2,
  });

  const { run: checkNameIsRegistered } = useContractOperation<
    ICheckIfRegisteredNameParams,
    boolean
  >({
    operation: useIsRegistered,
    inscribeable: false,
  });

  const handleValidate = (name: string) => {
    if (name) {
      setNameValidate(true);
    } else {
      setNameValidate(false);
    }
  };

  const handleCheckNameIsRegistered = async () => {
    try {
      setIsProcessing(true);
      const isRegistered = await checkNameIsRegistered({
        name: valueInput,
      });

      // If name has already been taken
      if (isRegistered) {
        showToastError({
          message: `${valueInput} has already been taken. Please choose another one.`,
        });
      }
      return isRegistered;
    } catch (err: unknown) {
      throw Error();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClickRegister = async () => {
    if (!isAuthenticated) {
      router.push(ROUTE_PATH.CONNECT_WALLET);
      return;
    }

    const nameRegistered = await handleCheckNameIsRegistered();
    if (!nameRegistered) {
      setShowModal(true);
    }
  };

  return (
    <>
      <NamesContainer>
        <div className="upload_left">
          <div className="upload_content">
            <h1 className="upload_title">Bitcoin Name System</h1>
            <Text className="upload_desc" size="medium">
              BNS is the standard for naming on Bitcoin. No more copying and pasting
              <br></br>
              long addresses. Use your BNS name to receive any token and NFT.
            </Text>
          </div>
        </div>
      </NamesContainer>
      <FormContainer>
        <div className="block_search">
          <div className="content" ref={registerInputRef}>
            <div className="form">
              <div className="input">
                <input
                  type="text"
                  placeholder="Enter name, address"
                  value={valueInput}
                  onChange={(e) => {
                    setValueInput(e.target.value || '');
                    handleValidate(e.target.value);
                  }}
                />
              </div>
              <div className="btn">
                <SubmitButton
                  bg={'btnBg'}
                  disabled={!nameValidate || isProcessing}
                  onClick={handleClickRegister}
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
              </div>
            </div>
            <ToolTips
              name="Remember you must have BTC to create a BNS"
              note={
                <p>
                  {
                    <a
                      className="textLink"
                      href="https://trustlesswallet.io/"
                      target="_blank"
                    >
                      Go to Wallet
                    </a>
                  }
                  , tap the copy icon to copy and paste your BTC address to the
                  address field on the platform you intend to withdraw BTC from. Make
                  a transfer from there and BTC will be credited to your wallet.
                </p>
              }
            />
          </div>
        </div>
      </FormContainer>
      <NamesList />
      <ModalSelectFee
        show={showModal}
        handleClose={() => setShowModal(false)}
        valueInput={valueInput}
        setValueInput={setValueInput}
        setNameValidate={setNameValidate}
      ></ModalSelectFee>
      <RegisterFooter isVisible={showRegisterFooter} />
    </>
  );
};

export default Names;
