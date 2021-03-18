import React, { useState } from "react";
import "./NftCard.css";
import { Nft } from "../types";

interface Props {
  nft: Nft;
}

const NftCard = ({ nft }: Props) => {
  const MaxDescriptionLength = 100;
  const [openDescription, setOpenDescription] = useState(false);
  const handleClick = () => {
    window.open(nft.link, "_blank");
  };

  const renderDescription = () => {
    const handleClick = () => {
      setOpenDescription(true);
    };
    if (openDescription) {
      return nft.description;
    } else {
      return (
        <>
          {nft.description?.length > MaxDescriptionLength
            ? nft.description?.substring(0, MaxDescriptionLength) + "..."
            : nft.description}
          <span onClick={handleClick} className="more">
            more
          </span>
        </>
      );
    }
  };
  return (
    <div className="NFT-container">
      <div>
        <img
          src={nft.image_url}
          className="NFT-image"
          onClick={handleClick}
          alt={nft.name}
        />
      </div>
      <div className="NFT-infoContainer">
        <div className="NFT-name">{nft.name}</div>
        {nft.description ? (
          <div className="NFT-description">{renderDescription()}</div>
        ) : null}
      </div>
    </div>
  );
};

export default NftCard;
