import React, { useState } from "react";
import SHA256 from "crypto-js/sha256";


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
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join("0"); // e.g. "0000" for difficulty=4
    let attempts = 0;

    const start = performance.now();

    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
      attempts++;
    }

    const end = performance.now();
    const timeTaken = ((end - start) / 1000).toFixed(2); // seconds

    return { attempts, timeTaken };
  }
}

export default function MiningSimulation() {
  const [miningResult, setMiningResult] = useState(null);

  const handleMine = () => {
    const block = new Block(1, new Date().toISOString(), { amount: 50 }, "0");

    // Difficulty: 4 leading zeros
    const difficulty = 4;

    const { attempts, timeTaken } = block.mineBlock(difficulty);

    setMiningResult({
      hash: block.hash,
      nonce: block.nonce,
      attempts,
      timeTaken,
      difficulty,
    });

    console.log('Block mined with hash: ${block.hash}');
    console.log('Nonce found: ${block.nonce}');
    console.log('Attempts needed: ${attempts}');
    console.log('Time taken: ${timeTaken} seconds');
  };

  return (
      <div className="mining-container">
    <div style={{ border: "1px solid #444", padding: 20, marginBottom: 20 }}>
      <h2>Nonce Mining Simulation (Proof of Work)</h2>
      <button onClick={handleMine}>Start Mining</button>

      {miningResult && (
         <div className="mining-result">
        <div style={{ marginTop: 15, backgroundColor: "#eee", padding: 10 }}>
          <p>
            <strong>Difficulty:</strong> {miningResult.difficulty} leading zeros
          </p>
          <p>
            <strong>Hash:</strong> {miningResult.hash}
          </p>
          <p>
            <strong>Nonce:</strong> {miningResult.nonce}
          </p>
          <p>
            <strong>Attempts:</strong> {miningResult.attempts}
          </p>
          <p>
            <strong>Time Taken:</strong> {miningResult.timeTaken} seconds
          </p>
        </div>
        </div>
      )}
      
    <p className="mining-note">
        Click the button to start mining a block with difficulty of 4 leading zeros. See nonce and time taken.
      </p>
    </div>
    </div>
  );
}