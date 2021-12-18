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

export const useWeb3 = () => {
  const [ethereum, setEthereum] = useState<any>(null);
  const [account, setAccount] = useState(null);
  useEffect(() => {
    const obj = checkIfWalletConnectedAndGetEthereumObj();
    setEthereum(obj);
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

  return { account, connect };
};
