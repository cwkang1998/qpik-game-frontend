import { Character } from "../../models/Character";
import "./SelectCharacter.css";

const SelectCharacter = ({
  setCharacterNFT,
}: {
  setCharacterNFT: React.Dispatch<React.SetStateAction<Character | undefined>>;
}) => {
  return (
    <div className="select-character-container">
      <h2>Mint Your Hero. Choose wisely.</h2>
    </div>
  );
};

export default SelectCharacter;
