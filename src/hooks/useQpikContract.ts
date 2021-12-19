import { useCallback, useEffect, useState } from "react";
import { JsonRpcSigner } from "@ethersproject/providers";
import { Contract } from "ethers";
import { CONTRACT_ADDRESS } from "../constants";
import QpikGame from "../abi/QpikGame.json";

export const useQpikContract = (signer?: JsonRpcSigner) => {
  const [contract, setContract] = useState<Contract>();

  useEffect(() => {
    const asyncFn = async () => {
      if (signer) {
        const gameContract = new Contract(
          CONTRACT_ADDRESS,
          QpikGame.abi,
          signer
        );
        setContract(gameContract);
      }
    };
    asyncFn();
  }, [signer]);

  const fetchNFTMetadata = useCallback(async () => {
    if (contract) {
      const txn = await contract.checkIfUserHasNFT();
      return txn;
    }
  }, [contract]);

  return { fetchNFTMetadata };
};
