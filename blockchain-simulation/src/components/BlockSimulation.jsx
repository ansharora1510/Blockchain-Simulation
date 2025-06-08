import React, { useState, useEffect, useRef } from "react";
import sha256 from "crypto-js/sha256";

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return sha256(
      this.index +
        this.timestamp +
        JSON.stringify(this.data) +
        this.previousHash +
        this.nonce
    ).toString();
  }

  mineBlockStep(difficulty) {
    const target = Array(difficulty + 1).join("0");
    this.nonce++;
    this.hash = this.calculateHash();
    return this.hash.startsWith(target);
  }
}

const BlockSimulation = () => {
  // Initialize chain with 3 blocks
  const initialChain = [
    new Block(0, Date.now().toString(), "Genesis Block", "0"),
    new Block(1, Date.now().toString(), { amount: 0 }, ""),
    new Block(2, Date.now().toString(), { amount: 50 }, ""),
  ];
  // Link hashes for initial chain
  initialChain[1].previousHash = initialChain[0].hash;
  initialChain[1].hash = initialChain[1].calculateHash();
  initialChain[2].previousHash = initialChain[1].hash;
  initialChain[2].hash = initialChain[2].calculateHash();

  const [chain, setChain] = useState(initialChain);
  const [difficulty, setDifficulty] = useState(4);
  const [miningInfo, setMiningInfo] = useState(null);
  const [isMining, setIsMining] = useState(false);
  const [block1DataText, setBlock1DataText] = useState(
    JSON.stringify(chain[1].data, null, 2)
  );
  const miningRef = useRef(null);
  const [jsonError, setJsonError] = useState(false);

  // Safe JSON parse helper
  const safeParse = (str) => {
    try { 
      setJsonError(false);
      return JSON.parse(str);
    } catch {
      setJsonError(true);
      return null;
    }
  };

  // Validate chain and return array of block validity
  const validateChainDetailed = (chain) => {
    const validity = chain.map(() => true);
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const prevBlock = chain[i - 1];
      if (
        currentBlock.hash !== currentBlock.calculateHash() ||
        currentBlock.previousHash !== prevBlock.hash
      ) {
        validity[i] = false;
      }
    }
    return validity;
  };

  const blockValidity = validateChainDetailed(chain);
  const isChainValid = blockValidity.every(Boolean);

  // Update Block 1 data from textarea
  const onDataChange = (e) => {
    setBlock1DataText(e.target.value);
    const parsedData = safeParse(e.target.value);
    if (parsedData !== null) {
      const newChain = [...chain];
      newChain[1].data = parsedData;
      newChain[1].hash = newChain[1].calculateHash();
      setChain(newChain);
      setMiningInfo(null);
      
    }
  };

  // Fix chain after tampering
  const fixChain = () => {
    const newChain = [...chain];
    for (let i = 1; i < newChain.length; i++) {
      newChain[i].previousHash = newChain[i - 1].hash;
      newChain[i].hash = newChain[i].calculateHash();
    }
    setChain(newChain);
    setMiningInfo(null);
    
  };

  // Reset chain to original genesis data
  const resetChain = () => {
    setChain(initialChain);
    setBlock1DataText(JSON.stringify(initialChain[1].data, null, 2));
    setMiningInfo(null);
   
    setJsonError(false);
  };

  // Stop mining if running
  const stopMining = () => {
    if (miningRef.current) {
      cancelAnimationFrame(miningRef.current);
      miningRef.current = null;
    }
    setIsMining(false);
    setMiningInfo(null);
  };

  // Mining with animation using requestAnimationFrame
  const mineBlock1 = () => {
    if (isMining || jsonError) return; // prevent multiple mines or invalid JSON

    setIsMining(true);
    const newChain = [...chain];
    const blockToMine = newChain[1];
    blockToMine.nonce = 0;
    blockToMine.hash = blockToMine.calculateHash();

    const target = Array(difficulty + 1).join("0");
    let attempts = 0;
    const start = performance.now();

    const mineStep = () => {
      let steps = 0;
      while (steps < 1000 && !blockToMine.hash.startsWith(target)) {
        blockToMine.nonce++;
        blockToMine.hash = blockToMine.calculateHash();
        attempts++;
        steps++;
      }

      setMiningInfo({
        difficulty,
        attempts,
        time: ((performance.now() - start) / 1000).toFixed(3),
        hashPreview: blockToMine.hash.slice(0, 20) + "...",
      });

      if (blockToMine.hash.startsWith(target)) {
        // Fix rest of chain after mining block 1
        for (let i = 2; i < newChain.length; i++) {
          newChain[i].previousHash = newChain[i - 1].hash;
          newChain[i].hash = newChain[i].calculateHash();
        }
        setChain(newChain);
        setIsMining(false);
       
        miningRef.current = null;
        return;
      } else {
        miningRef.current = requestAnimationFrame(mineStep);
      }
    };

    miningRef.current = requestAnimationFrame(mineStep);
  };

  
  useEffect(() => {
    return () => {
      if (miningRef.current) {
        cancelAnimationFrame(miningRef.current);
      }
    };
  }, []);

  return (
 
  <div
   
      style={{
        padding: 20,
        color: "#eee",
        backgroundColor: "#222",
        minHeight: "100vh",
        fontFamily: "monospace",
      }}
    >
      <h2>Blockchain Simulation with Editable Block 1 Data & Mining</h2>

      <label>
        Edit Block 1 Data (JSON):
        <textarea
          rows={4}
          style={{
            width: "100%",
            fontFamily: "monospace",
            marginTop: 5,
            marginBottom: 10,
            resize: "vertical",
            borderColor: jsonError ? "#f44336" : undefined,
          }}
          value={block1DataText}
          onChange={onDataChange}
          disabled={isMining}
        />
      </label>
      {jsonError && (
        <div style={{ color: "#f44336", marginBottom: 10 }}>
          ❌ Invalid . Please correct the data.
        </div>
      )}

      <div style={{ marginBottom: 10 }}>
        <label>
          Mining Difficulty (number of leading zeros):
          <input
            type="number"
            min={1}
            max={6}
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            disabled={isMining}
            style={{
              marginLeft: 10,
              width: 50,
              fontSize: "1em",
              fontFamily: "monospace",
              padding: "2px 5px",
            }}
          />
        </label>
      </div>

      <button onClick={fixChain} disabled={isMining} style={{ marginRight: 10 }}>
        Fix Chain
      </button>
      <button onClick={resetChain} disabled={isMining} style={{ marginRight: 10 }}>
        Reset Chain
      </button>

      {!isMining ? (
        <button
          onClick={mineBlock1}
          disabled={isMining || jsonError}
          style={{ marginRight: 10 }}
        >
          Mine Block 1 (Difficulty {difficulty})
        </button>
      ) : (
        <button onClick={stopMining} style={{ marginRight: 10, backgroundColor: "#f44336" }}>
          Stop Mining
        </button>
      )}

      {miningInfo && (
        <div style={{ marginTop: 15, color: "#4caf50" }}>
          <b>Mining Info:</b> Difficulty: {miningInfo.difficulty} | Attempts:{" "}
          {miningInfo.attempts} | Time: {miningInfo.time} sec <br />
          <small>Hash Preview: {miningInfo.hashPreview}</small>
        </div>
      )}

      <h3 style={{ marginTop: 20 }}>Blocks:</h3>
      <div>
        {chain.map((block, idx) => (
  <div
    key={block.index}
    style={{
      border: `2px solid ${blockValidity[idx] ? "#4caf50" : "#f44336"}`,
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
      backgroundColor: "#333",
    }}
  >
    <div>
      <strong>Block #{block.index}</strong>{" "}
      {!blockValidity[idx] && (
        <span style={{ color: "#f44336", fontWeight: "bold" }}>(Invalid)</span>
      )}
    </div>
    <div>Timestamp: {block.timestamp}</div>
    <div>Data: {JSON.stringify(block.data)}</div>
    <div>Nonce: {block.nonce}</div>
    <div>Previous Hash: {block.previousHash}</div>
    <div>Hash: {block.hash}</div>
  </div>
))}

        
      </div>

      <h3>Chain Validity:</h3>
      <div style={{ fontSize: 18 }}>
        {isChainValid ? (
          <span style={{ color: "#4caf50" }}>✅ The blockchain is valid.</span>
        ) : (
          <span style={{ color: "#f44336" }}>
            ❌ The blockchain is invalid! Data tampering detected.
          </span>
        )}
      </div>

    </div>
  );
};

export default BlockSimulation;