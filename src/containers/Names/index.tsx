import { useState } from 'react';
import Text from '@/components/Text';
import NamesList from './NamesList';
import {
  NamesContainer,
  FormContainer,
  SubmitButton,
  ToastPending,
} from './Names.styled';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import useIsRegistered, {
  ICheckIfRegisteredNameParams,
} from '@/hooks/contract-operations/bns/useIsRegistered';
import useRegister, {
  IRegisterNameParams,
} from '@/hooks/contract-operations/bns/useRegister';
import { Transaction } from 'ethers';
import toast from 'react-hot-toast';
import { CDN_URL, TC_WEB_URL } from '@/configs';
import IconSVG from '@/components/IconSVG';

const Names: React.FC = () => {
  const [nameValidate, setNameValidate] = useState(false);
  const [valueInput, setValueInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { run: checkNameIsRegistered } = useContractOperation<
    ICheckIfRegisteredNameParams,
    boolean
  >({
    operation: useIsRegistered,
    inscribeable: false,
  });
  const { run: registerName } = useContractOperation<
    IRegisterNameParams,
    Transaction | null
  >({
    operation: useRegister,
  });

  const handleValidate = (name: string) => {
    if (name) {
      setNameValidate(true);
    }
  };
  const handleRegistered = async () => {
    console.log(valueInput);

    setIsProcessing(true);

    // Check if name has been registered
    const isRegistered = await checkNameIsRegistered({
      name: valueInput,
    });

    // If name has already been taken
    if (isRegistered) {
      toast.error(
        `${valueInput} has already been taken. Please choose another one.`,
      );
      setIsProcessing(false);
      return;
    }

    // Call contract
    try {
      await registerName({
        name: valueInput,
      });
      toast.success('Transaction has been created. Please wait for few minutes.');
      setValueInput('');
    } catch (err) {
      if ((err as Error).message === 'pending') {
        toast.error(
          (t) => (
            <ToastPending>
              <div>
                You have some pending transactions. Please complete all of them
                before moving on.
                <br />
                <a
                  href={TC_WEB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="wallet-link"
                >
                  Go to Wallet
                  <IconSVG
                    src={`${CDN_URL}/icons/arrow-right.svg`}
                    maxHeight="16"
                    maxWidth="16"
                    color="#898989"
                    type="stroke"
                  />
                </a>
              </div>
              <div className="cursor-pointer" onClick={() => toast.dismiss(t.id)}>
                <IconSVG
                  src={`${CDN_URL}/icons/ic-close-1.svg`}
                  maxWidth="16"
                  maxHeight="16"
                  color="black"
                  type="fill"
                />
              </div>
            </ToastPending>
          ),
          {
            duration: 50000,
            position: 'top-right',
            style: {
              maxWidth: '900px',
              borderLeft: '4px solid #FF4747',
            },
          },
        );
      } else {
        toast.error((err as Error).message);
      }

      console.log(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <NamesContainer>
        <div className="upload_left">
          {/* <img src={IcImgName} alt="upload file icon" /> */}
          <div className="upload_content">
            <h3 className="upload_title">Bitcoin Name System</h3>
            <Text size="medium" maxWidth="90%">
              BNS is the standard for naming on Bitcoin. No more copying and pasting
              long addresses. Use your BNS name to receive any token and NFT.
            </Text>
          </div>
        </div>
      </NamesContainer>
      <FormContainer>
        <div className="block_search">
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
                // background={'btn'}
                disabled={!nameValidate || isProcessing}
                onClick={handleRegistered}
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
        </div>
      </FormContainer>
      <NamesList />
    </>
  );
};

export default Names;
