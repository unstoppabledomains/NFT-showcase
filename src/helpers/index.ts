import { Nft, UdNft } from "../types";
const CNSRegistry = "0xd1e5b0ff1287aa9f9a268759062e4ab08b9dacbe";
const UNSRegistry = "0x049aba7510f45ba5b64ea9e658e342f904db358d";
const ENSContract = "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85";

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
        nfts: nfts.reduce((a, c: UdNft) => {
          if (
            (c.name || c.tokenId) &&
            c.imageUrl &&
            c.tokenAddress.toLowerCase() !== CNSRegistry &&
            c.tokenAddress.toLowerCase() !== UNSRegistry &&
            c.tokenAddress.toLowerCase() !== ENSContract
          ) {
            const nft: Nft = {
              link: `https://opensea.io/assets/${c.tokenAddress}/${c.tokenId}`,
              name: c.name || c.tokenId,
              image_url: c.imageUrl,
              description: c.description || "",
              video_url: c.animationUrl || "",
            };
            a.push(nft);
          }
          return a;
        }, [] as Array<Nft>),
        received: nfts.length,
      };
    });
};
