import { useState, useEffect } from "react";
import "./App.css";
import { Nft } from "./types";
import NftCard from "./components/NftCard";
import { getNfts, getOwner } from "./helpers";
import useAsyncEffect from "use-async-effect";
import InfiniteScroll from "react-infinite-scroll-component";

const PageLimit = 50;

function App() {
  const [ethPage, setEthPage] = useState(0);
  const [l2Page, setL2Page] = useState(0);
  const [domainOwner, setDomainOwner] = useState("");
  const [nfts, setNfts] = useState([] as Nft[]);
  const [loading, setLoading] = useState(true);
  const [isAllEthNftsLoaded, setIsAllEthNftsLoaded] = useState(false); // No need to trigger a request when true
  const [isAllL2NftsLoaded, setIsAllL2NftsLoaded] = useState(false); // No need to trigger a request when true

  // useEffect(() => {
  //   const $style = document.createElement("style");
  //   document.head.appendChild($style);
  //   $style.innerHTML = `body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}code{font-family:source-code-pro,Menlo,Monaco,Consolas,"Courier New",monospace}.App{text-align:center}.App-logo{height:40vmin;pointer-events:none}@media (prefers-reduced-motion:no-preference){.App-logo{animation:App-logo-spin 20s linear infinite}}.App-header{background-color:#f9faff;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:calc(10px + 2vmin)}.App-link{color:#61dafb}@keyframes App-logo-spin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}.domain-name{word-break:break-all;font-size:41px;line-height:40px;text-align:center;color:#000;margin:0 0 50px}.colorful-highlight,.domain-name{font-family:"Open Sans",sans-serif;font-style:normal;font-weight:700}.colorful-highlight{background:linear-gradient(90deg,#9f1fed,#645ff2 52.6%,#4ec4d6);background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-size:20px;margin:30px}.loader-container{width:100%;grid-column:1/-1;display:flex;justify-content:center;margin-top:1em}.loader{animation:spin 1s linear infinite;border:5px solid #555;border-top-color:#f3f3f3;border-radius:50%;width:50px;height:50px}@keyframes spin{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}.black{color:#000}.infinite-scroll-component__outerdiv{max-width:1400px;width:100%}.infinite-scroll-component{display:grid;grid-template-columns:repeat(auto-fill,minmax(400px,1fr));grid-gap:32px;overflow:hidden!important;padding-bottom:100px}@media only screen and (max-width:400px){.infinite-scroll-component{grid-template-columns:repeat(auto-fill,minmax(300px,1fr))}}@media only screen and (min-width:1150px){.infinite-scroll-component{padding-left:48px;padding-right:48px}}@media only screen and (max-width:1150px){.infinite-scroll-component{margin:0;padding-left:20px;padding-right:20px}}@media only screen and (max-width:400px){.infinite-scroll-component{margin:0;padding-left:0;padding-right:0}}.margin-bottom{margin-bottom:100px}.powered-by-container{margin-bottom:100px;display:flex;align-items:center}.unstoppable-logo{margin-right:12px}.powered-by-margin-top{margin-top:100px}.powered-by-text{font-family:"Open Sans",sans-serif;font-style:normal;word-break:break-all;font-weight:600;font-size:16px;color:#a2a2a2}.blue-link-highlight{color:#4c47f7;cursor:pointer}.NFT-container{display:flex;flex-direction:column;width:auto;background-color:#fff;padding-top:20px;height:-webkit-fit-content;height:-moz-fit-content;height:fit-content;transition:all .3s ease 0s;box-shadow:0 27px 69px rgba(0,0,0,.04),0 8.13971px 20.8015px rgba(0,0,0,.0260636),0 3.38082px 8.63987px rgba(0,0,0,.02),0 1.22278px 3.12487px rgba(0,0,0,.0139364);border-radius:12px}.NFT-container:hover{box-shadow:0 19px 43px rgba(0,0,0,.22);transform:translate3d(0,-2px,0);transition:all .3s ease 0s}.NFT-image-container{height:300px}.NFT-image{cursor:pointer;object-fit:contain;width:auto;max-width:100%;height:100%}.NFT-infoContainer{padding:24px;min-height:100px}.NFT-name{font-family:"Open Sans",sans-serif;cursor:pointer;overflow:hidden;text-overflow:ellipsis;color:#223043;text-align:left;font-style:normal;position:static;font-weight:600;font-size:20px;color:#000}.NFT-name:hover{color:#00e}.NFT-description{font-size:15px;overflow:hidden;text-overflow:ellipsis;color:#6d6e76;text-align:left;min-height:43px;margin-top:8px}.more,.NFT-description{font-family:"Open Sans",sans-serif;font-style:normal}.more{cursor:pointer;color:#000;font-weight:600;margin-left:5px}.divider{background:#e8e8e8;margin:24px 0;height:1px}.created-by{font-family:"Open Sans",sans-serif;font-style:normal;display:flex;justify-content:flex-start;align-items:center;font-size:16px;color:#6d6e76}.created-by-image{width:24px;height:24px;margin-right:10px;border-radius:20px}.created-by-text{min-width:79px}.created-by-username{font-family:"Open Sans",sans-serif;font-style:normal;margin-left:5px;font-weight:700;color:#000;overflow:hidden;text-overflow:ellipsis;max-width:50%;cursor:pointer}.created-by-username:hover{color:#00e}`;
  // }, []);

  const handleUDClick = () => {
    window.open("https://unstoppabledomains.com", "_blank");
  };

  useAsyncEffect(async () => {
    const _domainOwner = await getOwner((window as any).domain);
    setDomainOwner(_domainOwner);
  }, []);

  useAsyncEffect(async () => {
    if (domainOwner) {
      await handleNextPage();
      setLoading(false);
    }
  }, [domainOwner]);

  const loadEthNfts = async () => {
    if (isAllEthNftsLoaded) {
      return [];
    }

    const { nfts: _nfts, received } = await getNfts(
      `https://unstoppabledomains.com/api/nfts/eth?offset=${
        ethPage * PageLimit
      }&limit=${PageLimit}&ownerAddress=${domainOwner}`
    );
    if (received < PageLimit) {
      setIsAllEthNftsLoaded(true);
    }
    setEthPage(ethPage + 1);
    return _nfts;
  };

  const loadL2Nfts = async () => {
    if (isAllL2NftsLoaded) {
      return [];
    }
    const { nfts: _nfts, received } = await getNfts(
      `https://unstoppabledomains.com/api/nfts/l2?offset=${
        l2Page * PageLimit
      }&limit=${PageLimit}&ownerAddress=${domainOwner}&chain=polygon`
    );
    if (received < PageLimit) {
      setIsAllL2NftsLoaded(true);
    }
    setL2Page(l2Page + 1);
    return _nfts;
  };

  const handleNextPage = async () => {
    const [ethNfts, l2Nfts] = await Promise.all([loadEthNfts(), loadL2Nfts()]);
    setNfts([...nfts, ...ethNfts, ...l2Nfts]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p className="colorful-highlight">NFT ART GALLERY</p>
        <p className="domain-name">{(window as any).domain}</p>
        {loading ? (
          <div className={"loader-container margin-bottom"}>
            <div className="loader"></div>
          </div>
        ) : (
          <InfiniteScroll
            hasMore={!isAllEthNftsLoaded || !isAllL2NftsLoaded}
            next={handleNextPage}
            dataLength={nfts.length}
            loader={
              <div className={"loader-container"}>
                <div className="loader"></div>
              </div>
            }
            scrollThreshold={0.7}
          >
            {nfts.map((nft, index) => (
              <NftCard nft={nft} key={index} />
            ))}
          </InfiniteScroll>
        )}
        {!loading && !nfts.length ? (
          <div className="black margin-bottom">
            No NFTs found in this wallet
          </div>
        ) : null}
        <div className={`powered-by-container`}>
          <svg
            className={"unstoppable-logo"}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M22.7319 2.06934V9.87229L0 19.094L22.7319 2.06934Z"
              fill="#2FE9FF"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M18.4696 1.71387V15.1917C18.4696 19.1094 15.2892 22.2853 11.3659 22.2853C7.44265 22.2853 4.26221 19.1094 4.26221 15.1917V9.51682L8.52443 7.17594V15.1917C8.52443 16.5629 9.63759 17.6745 11.0107 17.6745C12.3839 17.6745 13.497 16.5629 13.497 15.1917V4.4449L18.4696 1.71387Z"
              fill="#4C47F7"
            />
          </svg>
          <div className={"powered-by-text"}>
            Powered by{" "}
            <span className={"blue-link-highlight"} onClick={handleUDClick}>
              Unstoppable Domains
            </span>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
