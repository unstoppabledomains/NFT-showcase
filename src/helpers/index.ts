import { Nft, OpenSeaAsset } from "../types";
import BigNumber from "bignumber.js";
const UnstoppableContract = "0xd1e5b0ff1287aa9f9a268759062e4ab08b9dacbe";
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
            c.name &&
            c.image_url &&
            c.asset_contract.address.toLowerCase() !== UnstoppableContract &&
            c.asset_contract.address.toLowerCase() !== ENSContract
          ) {
            const nft: Nft = {
              link: c.permalink,
              name: c.name,
              image_url: c.image_url,
              description: c.description || "",
              video_url: c.animation_url || "",
              last_sale:
                c.last_sale && c.last_sale.total_price
                  ? weiToEth(c.last_sale.total_price)
                  : "",
            };
            a.push(nft);
          }
          return a;
        }, [] as Array<Nft>),
        received: assets.length,
      };
    });
};

const weiToEth = (wei: string) => {
  return new BigNumber(wei, 10).div("1000000000000000000").toString(10);
};
