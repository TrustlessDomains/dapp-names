export interface IBNS {
  name: string;
  id: string;
  owner: string;
}

export interface IOwnedBNS {
  id: string;
  tokenId: string;
  tokenIdInt: number;
  name: string;
  owner: string;
  collectionAddress: string;
  resolver: string;
  pfp?: string;
  pfpData?: {
    gcsUrl?: string;
    filename?: string;
  };
}
