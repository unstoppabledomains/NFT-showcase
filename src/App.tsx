import React, { useState } from "react";
import "./App.css";
import { Nft } from "./types";
import NftCard from "./components/NftCard";
import { getNfts, getOwner } from "./helpers";
import useAsyncEffect from "use-async-effect";
import InfiniteScroll from "react-infinite-scroll-component";

const PerPage = 10;
const OperaLimit = 50;

function App() {
  const [openSeaPage, setOpenSeaPage] = useState(0);
  const [page, setPage] = useState(0);
  const [isMoreOperaPages, setIsMoreOperaPages] = useState(false);
  const [domainOwner, setDomainOwner] = useState("");
  const [pages, setPages] = useState([] as Array<Nft[]>);
  const [nfts, setNfts] = useState([] as Nft[]);
  const [loading, setLoading] = useState(true);

  const getOpenSeaPages = async (_domainOwner: string, _page: number) => {
    const { nfts: _nfts, received } = await getNfts(
      _domainOwner,
      _page,
      OperaLimit
    );
    const _pages: Array<Nft[]> = [];
    for (let i = 0; i * PerPage < _nfts.length; i += 1) {
      _pages.push(_nfts.slice(i * PerPage, (i + 1) * PerPage));
    }
    if (received >= OperaLimit) {
      setIsMoreOperaPages(true);
    } else {
      setIsMoreOperaPages(false);
    }
    return _pages;
  };

  useAsyncEffect(async () => {
    const _domainOwner = await getOwner((window as any).domain);
    const _pages = await getOpenSeaPages(_domainOwner, openSeaPage);
    setPages(_pages);
    setNfts(_pages.length ? _pages[0] : []);
    setDomainOwner(_domainOwner);
    setLoading(false);
  }, []);

  const handleNextPageClick = async () => {
    const newPage = page + 1;
    if (newPage >= pages.length && isMoreOperaPages) {
      const newOpenSeaPage = openSeaPage + 1;
      const _pages = await getOpenSeaPages(domainOwner, newOpenSeaPage);
      setPages([...pages, ..._pages]);
      setNfts([...nfts, ..._pages[0]]);
      setOpenSeaPage(newOpenSeaPage);
    } else if (pages[newPage]) {
      setNfts([...nfts, ...pages[newPage]]);
    }
    setPage(newPage);
  };

  return (
    <div className="App">
      <header className="App-header">
        <p className="colorful-highlight">NFT ART GALLERY</p>
        <p className="domain-name">{(window as any).domain}</p>
        {loading ? (
          <div className={"loader-container"}>
            <div className="loader"></div>
          </div>
        ) : (
          <InfiniteScroll
            hasMore={page < pages.length || isMoreOperaPages}
            next={handleNextPageClick}
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
          <div className="black">No NFTs to display :(</div>
        ) : null}
      </header>
    </div>
  );
}

export default App;
