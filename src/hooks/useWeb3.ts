import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { useCallback, useEffect, useState } from "react";

const checkIfWalletConnectedAndGetEthereumObj = () => {
  const { ethereum } = window;
  if (!ethereum) {
    console.log("Make sure you have metamask");
    return null;
  } else {
    console.log("We have the ethereum object", ethereum);
    return ethereum;
  }
};

const checkNetwork = async () => {
  const { ethereum } = window;
  try {
    if (ethereum.networkVersion !== "4") {
      alert("Please connect to Rinkeby!");
    }
  } catch (err: any) {
    console.log(err);
  }
};

export const useWeb3 = () => {
  const [ethereum, setEthereum] = useState<any>(null);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState<Web3Provider>();
  const [signer, setSigner] = useState<JsonRpcSigner>();

  useEffect(() => {
    const obj = checkIfWalletConnectedAndGetEthereumObj();
    setEthereum(obj);
    if (obj) {
      checkNetwork();
    }
  }, []);

  useEffect(() => {
    const asyncFn = async () => {
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          console.log("Found an authorized account: ", accounts[0]);
          setAccount(accounts[0]);
        } else {
          console.log("No authorized account found.");
          setAccount(null);
        }

        // Setup provider
        const newProvider = new Web3Provider(ethereum);
        const newSigner = newProvider.getSigner();
        setProvider(newProvider);
        setSigner(newSigner);
      }
    };

    asyncFn();
  }, [ethereum]);

  const connect = useCallback(async () => {
    if (!ethereum) {
      alert("Get metamask!");
      return;
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected: ", accounts[0]);
      setAccount(accounts[0]);
    } catch (err: any) {
      console.error(err);
    }
  }, [ethereum, account]);

  return { account, provider, signer, connect };
};
