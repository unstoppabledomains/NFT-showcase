import { Nft, UdNft } from "../types";

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

const cleanNfts = (nfts: UdNft[]): Nft[] => {
  return nfts
    .filter((nft) => nft.category === "art")
    .map((nft) => ({
      link: formOpenSeaLink(nft),
      name: nft.name || nft.tokenId,
      image_url: nft.imageUrl,
      description: nft.description || "",
      video_url: nft.animationUrl || "",
    }));
};

export const getNfts = async (
  url: string
): Promise<{ nfts: Array<Nft>; received: number }> => {
  const resp = await fetch(url);
  const { nfts }: { nfts: UdNft[] } = await resp.json();
  const cleaned = cleanNfts(nfts);

  return { nfts: cleaned, received: nfts.length };
};
