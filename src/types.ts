export interface Nft {
  link: string;
  name: string;
  image_url: string;
  description: string;
  video_url: string;
  creator: {
    username?: string;
    profile_img?: string;
  };
}
export interface OpenSeaAsset {
  token_id: string;
  image_url: string;
  background_color: string;
  name?: string;
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
  creator: {
    user?: {
      username: string;
    };
    profile_img_url?: string;
    address?: string;
  };
}
