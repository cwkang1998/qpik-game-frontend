import { useEffect, useState } from "react";
import { useQpikContract } from "../../hooks/useQpikContract";
import { useWeb3 } from "../../hooks/useWeb3";
import { Character } from "../../models/Character";
import "./SelectCharacter.css";

const SelectCharacter = ({
  setCharacterNFT,
}: {
  setCharacterNFT: React.Dispatch<React.SetStateAction<Character | undefined>>;
}) => {
  const { signer } = useWeb3();
  const { fetchDefaultCharacters, mintCharacterNFTAction } =
    useQpikContract(signer);

  const [defaultCharacters, setDefaultCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const asyncFn = async () => {
      const data = await fetchDefaultCharacters();
      setDefaultCharacters(data);
    };
    asyncFn();
  }, [fetchDefaultCharacters]);

  const renderCharacters = () => {
    return defaultCharacters.map((character, idx) => (
      <div className="character-item" key={character.name}>
        <div className="name-container">
          <p>{character.name}</p>
        </div>
        <img src={character.imageURI} alt={character.name} />
        <button
          type="button"
          className="character-mint-button"
          onClick={() => mintCharacterNFTAction(idx)}
        >{`Mint ${character.name} `}</button>
      </div>
    ));
  };

  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
      {defaultCharacters.length > 0 && (
        <div className="character-grid">{renderCharacters()}</div>
      )}
    </div>
  );
};

export default SelectCharacter;
