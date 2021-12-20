import { useEffect, useState } from "react";
import { useQpikContract } from "../../hooks/useQpikContract";
import { useWeb3 } from "../../hooks/useWeb3";
import { Character } from "../../models/Character";
import { transformCharacterData } from "../../utils/transform";
import LoadingIndicator from "../LoadingIndicator";
import "./Arena.css";

const Arena = ({
  characterNFT,
  setCharacterNFT,
}: {
  characterNFT: Character;
  setCharacterNFT: React.Dispatch<React.SetStateAction<Character | undefined>>;
}) => {
  const { signer } = useWeb3();
  const { contract, fetchBoss, attackBoss } = useQpikContract(signer);
  const [boss, setBoss] = useState<Character>();
  const [attackState, setAttackState] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const asyncFn = async () => {
      const bossTxn = await fetchBoss();
      setBoss(transformCharacterData(bossTxn));
    };
    asyncFn();

    const onAttackComplete = (newBossHp: any, newPlayerHp: any) => {
      const bossHp = newBossHp.toNumber();
      const playerHp = newPlayerHp.toNumber();

      setBoss((prevState) => ({
        ...(prevState as Character),
        hp: bossHp,
      }));

      setCharacterNFT((prevState) => ({
        ...(prevState as Character),
        hp: playerHp,
      }));
    };

    if (contract) {
      contract.on("AttackComplete", onAttackComplete);
    }

    return () => {
      if (contract) {
        contract.off("AttackComplete", onAttackComplete);
      }
    };
  }, [signer, fetchBoss, contract, setCharacterNFT, characterNFT]);

  const runAttackAction = async () => {
    try {
      setAttackState("attacking");
      console.log("Attacking boss...");
      const txn = await attackBoss();
      console.log("attackTxn:", txn);
      setAttackState("hit");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 5000);
    } catch (err: any) {
      console.error(err);
      setAttackState("");
    }
  };

  return (
    <div className="arena-container">
      {/* Toasts */}
      {boss && characterNFT && (
        <div id="toast" className={showToast ? "show" : ""}>
          <div id="desc">{`${boss.name} was hit for ${characterNFT.attackDamage}!`}</div>
        </div>
      )}

      {/* Charactes */}
      {boss && (
        <div className="boss-container">
          <div className={`boss-content ${attackState}`}>
            <h2>{boss.name}</h2>
            <div className="image-content">
              <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          </div>
          <div className="attack-container">
            <button
              className="cta-button"
              onClick={runAttackAction}
            >{`Attack ${boss.name}`}</button>
          </div>
          {attackState === "attacking" && (
            <div className="loading-indicator">
              <LoadingIndicator />
              <p>Attacking...</p>
            </div>
          )}
        </div>
      )}

      {characterNFT && (
        <div className="players-container">
          <div className="player-container">
            <h2>Your Character</h2>
            <div className="player">
              <div className="image-content">
                <h2>{characterNFT.name}</h2>
                <img
                  src={characterNFT.imageURI}
                  alt={`Character ${characterNFT.name}`}
                />
                <div className="health-bar">
                  <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                  <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                </div>
              </div>
              <div className="stats">
                <h4>{`Attack Damage: ${characterNFT.attackDamage}`}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Arena;
