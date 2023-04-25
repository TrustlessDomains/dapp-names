import { useState } from 'react';
import Text from '@/components/Text';
import NamesList from './NamesList';
import { NamesContainer, FormContainer, SubmitButton } from './Names.styled';
import useContractOperation from '@/hooks/contract-operations/useContractOperation';
import useIsRegistered, {
  ICheckIfRegisteredNameParams,
} from '@/hooks/contract-operations/bns/useIsRegistered';
import useRegister, {
  IRegisterNameParams,
} from '@/hooks/contract-operations/bns/useRegister';
import { Transaction } from 'ethers';
import toast from 'react-hot-toast';
import { TC_WEB_URL } from '@/configs';
import { showError } from '@/utils/toast';
import { DappsTabs } from '@/enums/tabs';
import ToolTips from '@/components/ToolTips';

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
      showError({
        message: `${valueInput} has already been taken. Please choose another one.`,
      });
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
      setNameValidate(false);
    } catch (err) {
      if ((err as Error).message === 'pending') {
        showError({
          message:
            'You have some pending transactions. Please complete all of them before moving on.',
          url: `${TC_WEB_URL}/?tab=${DappsTabs.TRANSACTION}`,
          linkText: 'Go to Wallet',
        });
      } else {
        showError({
          message: (err as Error).message,
        });
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
          <div className="content">
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
            <ToolTips
              name="Remember you must have BTC to create a BNS"
              note="Go to Wallet, tap the copy icon to copy and paste your BTC address to the address field on the platform you intend to withdraw BTC from. Make a transfer from there and BTC will be credited to your wallet."
            />
          </div>
        </div>
      </FormContainer>
      <NamesList />
    </>
  );
};

export default Names;
