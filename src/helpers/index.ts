import { SerializedNftMetadata, NftCategory } from "../types";

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

export const getArtNfts = async ({
  ownerAddress,
  offset,
  limit,
}:{
  ownerAddress: string,
  offset: number,
  limit: number
}): Promise<Array<SerializedNftMetadata>> => {
  const resp = await fetch(
    `https://unstoppabledomains.com/api//nfts/eth?offset=${
      offset * limit
    }&limit=${limit}&owner=${ownerAddress}`
  )
  const {nfts}: {nfts: SerializedNftMetadata[]} = await resp.json();
  return nfts.filter((nft) => nft.category === NftCategory.Art);
};
