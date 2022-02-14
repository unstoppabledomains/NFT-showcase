import { useEffect, useState, useRef } from "react";
import "./NftCard.css";
import { Nft } from "../types";
import VisibilitySensor from "react-visibility-sensor";

interface Props {
  nft: Nft;
}

const NftCard = ({ nft }: Props) => {
  const MaxTextLength = 100;
  const videoRef = useRef(null);
  const [openDescription, setOpenDescription] = useState(false);
  const [openName, setOpenName] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showVideo, setShowVideo] = useState(true);

  const handleClick = () => {
    window.open(nft.link, "_blank");
  };

  useEffect(() => {
    const element = document.getElementById(nft.name);
    if (element) {
      element.addEventListener(
        "error",
        (e) => {
          setShowVideo(false);
        },
        true
      );
    }
  }, [nft]);

  useEffect(() => {
    if (isVisible) {
      if (videoRef && videoRef.current) {
        (videoRef.current as any).play();
      }
    } else {
      if (videoRef && videoRef.current) {
        (videoRef.current as any).pause();
      }
    }
  }, [isVisible]);

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

  const shouldRenderVideo = () => {
    if (!showVideo) {
      return false;
    }
    if (nft.video_url) {
      if (
        !nft.video_url.endsWith(".gif") &&
        !nft.video_url.endsWith(".gltf") &&
        !nft.video_url.endsWith(".glb") &&
        !nft.video_url.endsWith(".mp3")
      ) {
        return true;
      }
    }
    // For case when image_url incorrectly provides video file
    if (nft.image_url && nft.image_url.endsWith(".mp4")) {
      return true;
    }
    return false;
  };
  return (
    <div className="NFT-container">
      <div className="NFT-image-container">
        {shouldRenderVideo() ? (
          <VisibilitySensor onChange={(isVis) => setIsVisible(isVis)}>
            <video
              id={nft.name}
              onClick={handleClick}
              muted
              playsInline
              autoPlay
              controlsList="nodownload"
              loop
              preload="auto"
              src={nft.video_url || nft.image_url}
              className="NFT-image"
              ref={videoRef}
            />
          </VisibilitySensor>
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
        <div className="NFT-name" onClick={handleClick}>
          {renderName()}
        </div>
        <div className="NFT-description">
          {nft.description ? renderDescription() : null}
        </div>
      </div>
    </div>
  );
};

export default NftCard;
