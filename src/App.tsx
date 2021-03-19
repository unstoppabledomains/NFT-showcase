import React, { useEffect, useState } from "react";
import "./App.css";
import { Nft } from "./types";
import NftCard from "./components/NftCard";

const getOwner = async (domain: string) => {
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

const getNfts = async (ownerAddress: string): Promise<Array<Nft>> => {
  return fetch(
    `https://api.opensea.io/api/v1/assets?order_direction=desc&offset=0&limit=20&owner=${ownerAddress}`,
    {
      method: "GET",
    }
  )
    .then((resp) => resp.json())
    .then(({ assets }) => {
      return assets.map((asset: any) => {
        return {
          link: asset.permalink,
          name: asset.name,
          image_url: asset.image_url,
          description: asset.description,
        };
      });
    });
};

function App() {
  const [nfts, setNfts] = useState([] as Nft[]);
  const init = async () => {
    const domainOwner = await getOwner((window as any).domain);
    const nftList = await getNfts(domainOwner);

    setNfts(nftList);
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>{(window as any).domain}</h1>
        <div className="NFTs-container">
          {nfts.map((nft) => (
            <NftCard nft={nft} />
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
