import { useCallback, useEffect, useState } from "react";
import { JsonRpcSigner } from "@ethersproject/providers";
import { Contract } from "ethers";
import { CONTRACT_ADDRESS } from "../constants";
import QpikGame from "../abi/QpikGame.json";
import { transformCharacterData } from "../utils/transform";
import { Character } from "../models/Character";

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

  const fetchDefaultCharacters = useCallback(async (): Promise<Character[]> => {
    if (contract) {
      try {
        console.log("Getting contract characters to mint");
        const charactersTxn = await contract.getAllDefaultCharacters();

        console.log(charactersTxn);

        const characters = charactersTxn.map((characterData: any) =>
          transformCharacterData(characterData)
        );

        return characters;
      } catch (err: any) {
        console.log(err);
      }
    }
    return [];
  }, [contract]);

  const mintCharacterNFTAction = useCallback(
    async (characterId: number) => {
      if (contract) {
        try {
          console.log("Minting character in progress...");
          const mintTxn = await contract.mintCharacterNFT(characterId);
          await mintTxn.wait();
          console.log("mintTxn:", mintTxn);
        } catch (err: any) {
          console.error("MintCharacterAction Error:", err);
        }
      }
    },
    [contract]
  );

  const fetchNFTMetadata = useCallback(async () => {
    if (contract) {
      const txn = await contract.checkIfUserHasNFT();
      return txn;
    }
  }, [contract]);

  return {
    contract,
    fetchNFTMetadata,
    fetchDefaultCharacters,
    mintCharacterNFTAction,
  };
};
