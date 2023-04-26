export const walletLinkSignTemplate = ({
  transactionType,
  dAppType,
  hash,
  isRedirect,
}: {
  transactionType: string;
  dAppType: string;
  hash: string;
  isRedirect: boolean;
}) => {
  return `https://trustlesswallet.io/?function=sign&hash=${hash}&method=${transactionType}%20${dAppType}&dappURL=${window.location.origin}&isRedirect=${isRedirect}`;
};
