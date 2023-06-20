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
    image: `${CDN_URL}/pages/bns/get-started/create-tc-wallet/Screen%20Shot%202023-06-19%20at%2011.41.29%20AM.png`,
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
    image: `${CDN_URL}/pages/bns/get-started/create-tc-wallet/Screen%20Shot%202023-06-19%20at%2011.43.37%20AM.png`,
  },
  {
    title: 'Step 4: Check your balance',
    content: <p>Check your balance here.</p>,
    image: `${CDN_URL}/pages/bns/get-started/create-tc-wallet/Screen%20Shot%202023-06-19%20at%2011.38.00%20AM.png`,
  },
];

const STEP_2_CONTENT = [
  {
    title: 'STEP 1: Choose the BNS you want to register',
    content: '',
    image: `${CDN_URL}/pages/bns/get-started/register/Screen%20Shot%202023-06-19%20at%204.58.37%20PM.png`,
  },
  {
    title: 'STEP 2: Pay the TC network fee',
    content: '',
    image: `${CDN_URL}/pages/bns/get-started/register/Screen%20Shot%202023-06-19%20at%204.27.03%20PM.png`,
  },
  {
    title: 'STEP 3: Pay the  BTC network fee',
    content: '',
    image: `${CDN_URL}/pages/bns/get-started/register/Screen%20Shot%202023-06-19%20at%204.27.41%20PM.png`,
  },
  {
    title:
      'STEP 4: When the registration process is completed, your BNS will appear on your wallet, under the “Names” tab',
    content: '',
    image: `${CDN_URL}/pages/bns/get-started/register/Screen%20Shot%202023-06-19%20at%205.21.10%20PM.png`,
  },
];

const STEP_3_CONTENT = [
  {
    title: '• Select the default BNS for your TC address',
    content: '',
    image: `${CDN_URL}/pages/bns/get-started/manage/Screen%20Shot%202023-06-19%20at%204.58.37%20PM.png`,
  },
  {
    title: '• Update the avatar for your BNS',
    content: 'Note that the BTC and TC network fees depend on the image size',
    image: `${CDN_URL}/pages/bns/get-started/manage/Screen%20Shot%202023-06-19%20at%205.22.02%20PM.png`,
  },
  {
    title: '• Link a BNS to another TC address',
    content: '',
    image: `${CDN_URL}/pages/bns/get-started/manage/Screen%20Shot%202023-06-19%20at%205.03.33%20PM.png`,
  },
];

const GetStarted = () => {
  return (
    <StyledGetStarted>
      <div className="wrapper">
        <h1 className="title">Get started</h1>
        <StepBlock>
          <h3 id="create-tc-wallet">
            1. Create TC Wallet, top-up TC, and BTC for the network fee&nbsp;
            <a className="anchor" href="#create-tc-wallet">
              #
            </a>
          </h3>
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
        <StepBlock>
          <h3 id="register">
            2. REGISTER BNS&nbsp;
            <a className="anchor" href="#register">
              #
            </a>
          </h3>
          <div className="content-wrapper">
            {STEP_2_CONTENT.map((item, index) => (
              <div className="content-wrapper-item" key={`step-2-${index}`}>
                <SubStepBlock title={item.title}>{item.content}</SubStepBlock>
                <div className="image-wrapper">
                  <img src={item.image} alt="get started image instruction" />
                </div>
              </div>
            ))}
          </div>
        </StepBlock>
        <StepBlock>
          <h3 id="manage">
            3. MANAGE YOUR BNS{' '}
            <a
              className="normal-link"
              href="https://trustless.domains/setting"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://trustless.domains/setting
            </a>{' '}
            <a className="anchor" href="#manage">
              #
            </a>
          </h3>
          <div className="content-wrapper">
            {STEP_3_CONTENT.map((item, index) => (
              <div className="content-wrapper-item" key={`step-2-${index}`}>
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
