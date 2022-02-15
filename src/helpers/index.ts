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

export const getEthNfts = async (
  ownerAddress: string,
  offset: number,
  limit: number
): Promise<{ nfts: Array<Nft>; received: number }> => {
  return fetch(
    `https://unstoppabledomains.com/api/nfts/eth?offset=${
      offset * limit
    }&limit=${limit}&ownerAddress=${ownerAddress}`,
    {
      method: "GET",
    }
  )
    .then((resp) => resp.json())
    .then(({ nfts }: { nfts: UdNft[] }) => {
      return {
        nfts: nfts
          .filter((nft) => nft.category === "art")
          .map((nft) => ({
            link: `https://opensea.io/assets/${nft.tokenAddress}/${nft.tokenId}`,
            name: nft.name || nft.tokenId,
            image_url: nft.imageUrl,
            description: nft.description || "",
            video_url: nft.animationUrl || "",
          })),
        received: nfts.length,
      };
    });
};
