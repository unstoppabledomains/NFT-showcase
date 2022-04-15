export interface Nft {
  link: string;
  name: string;
  image_url: string;
  description: string;
  video_url: string;
}
export interface UdNft {
  animationUrl: string | null;
  category: string;
  chainId: string;
  contractType: string;
  description: string;
  imageUrl: string;
  name: string;
  ownerOf: string;
  tokenAddress: string;
  tokenId: string;
  symbol: string | null;
}

export enum NftCategory {
  Art = 'art',
  Other = 'other',
}
