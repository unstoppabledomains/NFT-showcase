import React, { useState } from "react";
import "./App.css";
import { Nft } from "./types";
import NftCard from "./components/NftCard";
import { getNfts, getOwner } from "./helpers";
import useAsyncEffect from "use-async-effect";

const PerPage = 10;
const OperaLimit = 50;

function App() {
  const [openSeaPage, setOpenSeaPage] = useState(0);
  const [page, setPage] = useState(0);
  const [isNextPage, setIsNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [domainOwner, setDomainOwner] = useState("");
  const [pages, setPages] = useState([] as Array<Nft[]>);

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
      setIsNextPage(true);
    } else {
      setIsNextPage(false);
    }
    return _pages;
  };

  useAsyncEffect(async () => {
    const _domainOwner = await getOwner((window as any).domain);
    const _pages = await getOpenSeaPages(_domainOwner, openSeaPage);
    setPages([...pages, ..._pages]);
    setLoading(false);
    setDomainOwner(_domainOwner);
  }, []);

  const handlePrevPageClick = async () => {
    const newPage = page - 1;

    setPage(newPage);
  };

  const handleNextPageClick = async () => {
    const newPage = page + 1;

    if (newPage >= pages.length && isNextPage) {
      const newOpenSeaPage = openSeaPage + 1;
      setLoading(true);
      const _pages = await getOpenSeaPages(domainOwner, newOpenSeaPage);
      setPages([...pages, ..._pages]);
      setLoading(false);
      setOpenSeaPage(newOpenSeaPage);
    }
    setPage(newPage);
  };

  const renderNextButton = () => {
    if (page + 1 >= pages.length && !isNextPage) {
      return null;
    }
    return (
      <a href="/#" onClick={handleNextPageClick}>
        &raquo;
      </a>
    );
  };

  const renderPagination = () => {
    const pageList = [];
    for (let i = 1; i <= pages.length; i++) {
      pageList.push(i);
    }
    if (pageList.length === 1) {
      return null;
    }
    return (
      <div className="pagination">
        {page > 0 ? (
          <a href="/#" onClick={handlePrevPageClick}>
            &laquo;
          </a>
        ) : null}
        {pageList.map((p) => {
          const handleClick = () => {
            setPage(p - 1);
          };
          return (
            <a
              href="/#"
              onClick={handleClick}
              className={p - 1 === page ? "active" : ""}
            >
              {p}
            </a>
          );
        })}
        {renderNextButton()}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="domain-name">{(window as any).domain}</h1>
        {loading ? <div className="loader"></div> : null}
        {!loading ? (
          <>
            <div className="NFTs-container">
              {pages[page]
                ? pages[page].map((nft) => <NftCard nft={nft} key={nft.name} />)
                : null}
            </div>
            {renderPagination()}
          </>
        ) : null}
      </header>
    </div>
  );
}

export default App;
