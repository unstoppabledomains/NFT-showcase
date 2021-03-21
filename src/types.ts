export interface Nft {
  link: string;
  name: string;
  image_url: string;
  description: string;
  video_url: string;
  last_sale: string; // ETH
}
export interface OpenSeaAsset {
  token_id: string;
  image_url: string;
  background_color: string;
  name: string;
  external_link: string;
  permalink: string;
  description?: string;
  animation_url?: string;
  asset_contract: {
    address: string;
    name: string;
  };
  owner: {
    address: string;
  };
  last_sale?: {
    total_price: string; // Wei
    payment_token: {
      id: 1;
      symbol: "ETH";
      address: "0x0000000000000000000000000000000000000000";
      image_url: "https://lh3.googleusercontent.com/7hQyiGtBt8vmUTq4T0aIUhIhT00dPhnav87TuFQ5cLtjlk724JgXdjQjoH_CzYz-z37JpPuMFbRRQuyC7I9abyZRKA";
      name: "Ether";
      decimals: 18;
      eth_price: "0.985708303649603";
      usd_price: string;
    };
  };
}
