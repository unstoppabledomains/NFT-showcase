import { Nft, UdNft, NftCategory } from "../types";

export const MORALIS_SYMBOLS_BLACKLIST = ['UD'];
export const MORALIS_TOKEN_ADDRESSES_BLACKLIST = [
  '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85', // ENS
];

export const getOwner = async (domain: string) => {
  return fetch(`https://unstoppabledomains.com/api/v1/${domain}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((resp) => resp.json())
    .then((data) => {
      return data?.meta?.owner;
    });
};

const formOpenSeaLink = (nft: UdNft) => {
  let chainPrefix = "";
  if (nft.chainId === "137") {
    chainPrefix = "matic/";
  }
  return `https://opensea.io/assets/${chainPrefix}${nft.tokenAddress}/${nft.tokenId}`;
};

const getNftCategory = (
  nft: UdNft,
  metadataImage?: string | null,
): NftCategory => {
  if (
    metadataImage &&
    nft.tokenAddress &&
    !MORALIS_TOKEN_ADDRESSES_BLACKLIST.includes(nft.tokenAddress) &&
    !MORALIS_SYMBOLS_BLACKLIST.includes(nft.symbol ?? '')
  ) {
    return NftCategory.Art;
  } else {
    return NftCategory.Other;
  }
};

const cleanNfts = (nfts: UdNft[]): Nft[] => {
  return nfts
    .map((nft) => ({
      link: formOpenSeaLink(nft),
      name: nft.name || nft.tokenId,
      image_url: nft.imageUrl,
      description: nft.description || "",
      video_url: nft.animationUrl || "",
      category: nft.category || getNftCategory(nft, nft.imageUrl),
    }))
    .filter((nft) => nft.category === "art");
};

export const getNfts = async (
  url: string
): Promise<{ nfts: Array<Nft>; received: number }> => {
  const resp = await fetch(url);
  const { nfts }: { nfts: UdNft[] } = await resp.json();
  const cleaned = cleanNfts(nfts);

  return { nfts: cleaned, received: nfts.length };
};
