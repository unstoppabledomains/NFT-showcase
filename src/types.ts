enum Network {
  Mainnet = '1',
  Goerli = '5',
  Polygon = '137',
  Mumbai = '80001',
}

export enum NftCategory {
  Art = 'art',
  Other = 'other',
}

export type SerializedNftMetadata = {
  image: string | null;
  name: string | null;
  description: string | null;
  animationUrl: string | null;
  tokenAddress: string;
  tokenId: string;
  ownerOf: string;
  contractType: string;
  chainId: Network;
  category: NftCategory;
};
