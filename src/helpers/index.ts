import { Nft, OpenSeaAsset } from "../types";
const CNSRegistry = "0xd1e5b0ff1287aa9f9a268759062e4ab08b9dacbe";
const UNSRegistry = "0x049aba7510f45ba5b64ea9e658e342f904db358d";
const ENSContract = "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85";

export const getOwner = async (domain: string) => {
  return fetch(
    "https://api.thegraph.com/subgraphs/name/unstoppable-domains-integrations/dot-crypto-registry",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{domains(first: 1, where: {name: "${domain}"}) {  id  name  owner {    id  } } }`,
      }),
    }
  )
    .then((resp) => resp.json())
    .then(({ data }) => {
      return data.domains[0].owner.id;
    });
};

export const getNfts = async (
  ownerAddress: string,
  offset: number,
  limit: number
): Promise<{ nfts: Array<Nft>; received: number }> => {
  return fetch(
    `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=${
      offset * limit
    }&limit=${limit}&owner=${ownerAddress}`,
    {
      method: "GET",
    }
  )
    .then((resp) => resp.json())
    .then(({ assets }: { assets: OpenSeaAsset[] }) => {
      return {
        nfts: assets.reduce((a, c: OpenSeaAsset) => {
          if (
            (c.name || c.token_id) &&
            c.image_url &&
            c.asset_contract.address.toLowerCase() !== CNSRegistry &&
            c.asset_contract.address.toLowerCase() !== UNSRegistry &&
            c.asset_contract.address.toLowerCase() !== ENSContract
          ) {
            const nft: Nft = {
              link: c.permalink,
              name: c.name || c.token_id,
              image_url: c.image_url,
              description: c.description || "",
              video_url: c.animation_url || "",
              creator: {
                username:
                  c.creator?.user?.username || c.creator?.address || "Unknown",
                profile_img: c.creator?.profile_img_url || "",
              },
            };
            a.push(nft);
          }
          return a;
        }, [] as Array<Nft>),
        received: assets.length,
      };
    });
};
