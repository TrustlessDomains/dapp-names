import Link from 'next/link';

import SubStepBlock from '@/components/StepBlock';
import { CDN_URL } from '@/configs';

import { StepBlock, StyledGetStarted } from './GetStarted.styled';

const STEP_1_CONTENT = [
  {
    title: 'Step 1: Create a TC Wallet',
    content: (
      <p>
        Go to{' '}
        <Link
          href="https://trustlesswallet.io"
          target="_blank"
          className="text-underline"
        >
          trustlesswallet.io
        </Link>{' '}
        and connect your Metamask wallet.
        <br /> After connecting, you will have a TC wallet address and a BTC wallet
        address.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/img-getstarted-1a.png`,
  },
  {
    title: 'Step 2: Top up TC',
    content: (
      <p>
        Top up TC at{' '}
        <Link
          href="https://tcgasstation.com/"
          target="_blank"
          className="text-underline"
        >
          https://tcgasstation.com/
        </Link>
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/img-getstarted-2.png`,
  },
  {
    title: 'Step 3: Top up BTC',
    content: (
      <p>
        Send BTC to your newly generated BTC wallet address for the network fee.
        Please send BTC from a wallet/platform that supports the taproot type.
      </p>
    ),
    image: `${CDN_URL}/pages/nfts/img-getstarted-3a.png`,
  },
  {
    title: 'Step 4: Check your balance',
    content: <p>Check your balance here.</p>,
    image: `${CDN_URL}/pages/nfts/img-getstarted-4a.png`,
  },
];

const GetStarted = () => {
  return (
    <StyledGetStarted>
      <div className="wrapper">
        <h1 className="title">Get started</h1>
        <StepBlock>
          <h3>Create TC Wallet, top-up TC, and BTC for the network fee</h3>
          <div className="content-wrapper">
            {STEP_1_CONTENT.map((item, index) => (
              <div className="content-wrapper-item" key={`step-1-${index}`}>
                <SubStepBlock title={item.title}>{item.content}</SubStepBlock>
                <div className="image-wrapper">
                  <img src={item.image} alt="get started image instruction" />
                </div>
              </div>
            ))}
          </div>
        </StepBlock>
      </div>
    </StyledGetStarted>
  );
};

export default GetStarted;
