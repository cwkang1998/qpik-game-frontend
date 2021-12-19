import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";
import { useWeb3 } from "./hooks/useWeb3";
import SelectCharacter from "./components/SelectCharacter";
import { useQpikContract } from "./hooks/useQpikContract";
import { transformCharacterData } from "./utils/transform";
import { Character } from "./models/Character";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const { connect, account, signer } = useWeb3();
  const { contract, fetchNFTMetadata } = useQpikContract(signer);
  const [characterNFT, setCharacterNFT] = useState<Character>();

  useEffect(() => {
    const onCharacterMint = async (
      sender: string,
      tokenId: any,
      characterIndex: any
    ) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );
      if (contract) {
        const txn = await fetchNFTMetadata();
        console.log("CharacterNFT: ", txn);
        setCharacterNFT(transformCharacterData(txn));
      }
    };

    const asyncFn = async () => {
      const txn = await fetchNFTMetadata();
      if (txn?.name) {
        console.log("User has character NFT");
        setCharacterNFT(transformCharacterData(txn));
      } else {
        console.log("No character NFT found");
      }
    };

    if (account) {
      console.log("CurrentAccount:", account);
      asyncFn();
    }

    if (contract) {
      contract.on("CharacterNFTMinted", onCharacterMint);
    }

    return () => {
      if (contract) {
        contract.off("CharacterNFTMinted", onCharacterMint);
      }
    };
  }, [account, contract, fetchNFTMetadata]);

  const renderContent = () => {
    if (!account) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
            alt="Monty Python Gif"
          />

          <button
            className="cta-button connect-wallet-button"
            onClick={() => connect()}
          >
            Connect Wallet to Get Started
          </button>
        </div>
      );
    } else if (account && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Metaverse Slayer ⚔️</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
