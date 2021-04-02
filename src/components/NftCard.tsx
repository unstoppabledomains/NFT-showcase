import React, { useState } from "react";
import "./NftCard.css";
import { Nft } from "../types";

interface Props {
  nft: Nft;
}

const NftCard = ({ nft }: Props) => {
  const MaxTextLength = 100;
  const [openDescription, setOpenDescription] = useState(false);
  const [openName, setOpenName] = useState(false);

  const handleClick = () => {
    window.open(nft.link, "_blank");
  };

  const renderName = () => {
    const handleMoreClick = () => {
      setOpenName(true);
    };

    if (openName) {
      return nft.name;
    } else {
      return nft.name.length > MaxTextLength ? (
        <>
          {nft.name.substring(0, MaxTextLength) + "..."}
          <span onClick={handleMoreClick} className="more">
            more
          </span>
        </>
      ) : (
        nft.name
      );
    }
  };

  const renderDescription = () => {
    const handleMoreClick = () => {
      setOpenDescription(true);
    };

    if (openDescription) {
      return nft.description;
    } else {
      return nft.description.length > MaxTextLength ? (
        <>
          {nft.description.substring(0, MaxTextLength) + "..."}
          <span onClick={handleMoreClick} className="more">
            more
          </span>
        </>
      ) : (
        nft.description
      );
    }
  };

  return (
    <div className="NFT-container">
      <div className="NFT-image-container">
        {nft.video_url &&
        !nft.video_url.endsWith(".gif") &&
        !nft.video_url.endsWith(".gltf") &&
        !nft.video_url.endsWith(".glb") &&
        !nft.video_url.endsWith(".mp3") ? (
          <video
            onClick={handleClick}
            muted
            playsInline
            autoPlay
            controlsList="nodownload"
            loop
            preload="auto"
            src={nft.video_url}
            className="NFT-image"
          />
        ) : (
          <img
            src={nft.image_url}
            className="NFT-image"
            onClick={handleClick}
            alt={nft.name}
          />
        )}
      </div>
      <div className="NFT-infoContainer">
        <div className="NFT-name">{renderName()}</div>
        {nft.description ? (
          <div className="NFT-description">{renderDescription()}</div>
        ) : null}
        <div className="divider" />
        <div className="created-by">
          {nft.creator.profile_img ? (
            <img
              src={nft.creator.profile_img}
              alt="profile"
              className="created-by-image"
            />
          ) : (
            <div />
          )}
          <span className="created-by-text">Created by</span>
          <span className="created-by-username">{nft.creator.username}</span>
        </div>
      </div>
    </div>
  );
};

export default NftCard;
