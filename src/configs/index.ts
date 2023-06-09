/* eslint-disable @typescript-eslint/no-non-null-assertion */

// App configs
export const APP_ENV: string = process.env.NEXT_PUBLIC_MODE!;
export const API_URL: string = process.env.NEXT_PUBLIC_API_URL!;
export const TC_NETWORK_RPC: string = process.env.NEXT_PUBLIC_TC_NETWORK_RPC!;
export const CDN_URL: string = process.env.NEXT_PUBLIC_CDN_URL!;
export const API_FAUCET: string = process.env.NEXT_PUBLIC_API_FAUCET!;
export const FETCH_LIMIT = 32;

// Contract configs
export const ARTIFACT_CONTRACT: string = process.env.NEXT_PUBLIC_ARTIFACT_CONTRACT!;
export const BNS_CONTRACT: string = process.env.NEXT_PUBLIC_BNS_CONTRACT!;
export const BFS_ADDRESS: string = process.env.NEXT_PUBLIC_BFS_CONTRACT!;

export const TC_WEB_URL: string = process.env.NEXT_PUBLIC_TC_WEB_URL!;
export const TRANSFER_TX_SIZE = 1000!;

// Domain
export const TC_DOMAIN_URL = process.env.NEXT_PUBLIC_TC_DOMAIN_URL!;
/* eslint-enable @typescript-eslint/no-non-null-assertion */
