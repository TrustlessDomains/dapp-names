import { useRef } from 'react';
import { useIsInViewport } from '@/hooks/useIsInViewport';
import Text from '@/components/Text';
import ToolTips from '@/components/ToolTips';
import RegisterFooter from '@/components/RegisterFooter';
import RegisterForm from '@/components/BNS/RegisterForm';

import NamesList from './NamesList';
import { FormContainer, NamesContainer } from './Names.styled';

const Names: React.FC = () => {
  const registerInputRef = useRef<HTMLDivElement>(null);

  const showRegisterFooter = useIsInViewport(registerInputRef, {
    threshold: 0.2,
  });

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
            <RegisterForm />
            <ToolTips
              name="Remember to have both TC and BTC as network fees to register a BNS"
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
      <RegisterFooter isVisible={showRegisterFooter} />
    </>
  );
};

export default Names;
