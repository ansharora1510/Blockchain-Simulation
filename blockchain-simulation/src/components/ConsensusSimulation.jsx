
import React, { useState } from "react";

export default function ConsensusSimulation() {
  // Mock validators for each consensus type
  const powValidators = [
    { id: "MinerA", power: Math.floor(Math.random() * 100) + 1 },
    { id: "MinerB", power: Math.floor(Math.random() * 100) + 1 },
    { id: "MinerC", power: Math.floor(Math.random() * 100) + 1 },
  ];

  const posValidators = [
    { id: "StakerA", stake: Math.floor(Math.random() * 1000) + 100 },
    { id: "StakerB", stake: Math.floor(Math.random() * 1000) + 100 },
    { id: "StakerC", stake: Math.floor(Math.random() * 1000) + 100 },
  ];

  // For DPoS, votes given to delegates
  const dposVotes = {
    DelegateA: 15,
    DelegateB: 30,
    DelegateC: 25,
  };

  const [result, setResult] = useState(null);

  function selectPoW() {
    const winner = powValidators.reduce((max, v) =>
      v.power > max.power ? v : max
    );
    console.log(
      `PoW: Selected validator with highest power: ${winner.id} (Power: ${winner.power})`
    );
    return `PoW winner: ${winner.id} with power ${winner.power}`;
  }

  function selectPoS() {
    const winner = posValidators.reduce((max, v) =>
      v.stake > max.stake ? v : max
    );
    console.log(
      `PoS: Selected validator with highest stake: ${winner.id} (Stake: ${winner.stake})`
    );
    return `PoS winner: ${winner.id} with stake ${winner.stake}`;
  }

  function selectDPoS() {
    // Create array where delegates appear proportionally to votes
    const delegates = [];
    Object.entries(dposVotes).forEach(([delegate, votes]) => {
      for (let i = 0; i < votes; i++) delegates.push(delegate);
    });

    // Randomly pick one delegate based on votes
    const winner =
      delegates[Math.floor(Math.random() * delegates.length)];

    console.log(
      `DPoS: Randomly selected delegate based on votes: ${winner} (Votes: ${dposVotes[winner]})`
    );
    return `DPoS winner: ${winner} with votes ${dposVotes[winner]}`;
  }

  const runSimulations = () => {
    const powResult = selectPoW();
    const posResult = selectPoS();
    const dposResult = selectDPoS();

    setResult({ powResult, posResult, dposResult });
  };

  return (
      <div className="consensus-container">
    <div style={{ border: "1px solid #444", padding: 20 }}>
      <h2>Consensus Mechanism Simulation</h2>
      <button onClick={runSimulations}>Run Consensus Simulation</button>

      {result && (
        <div className="consensus-result">
        <div style={{ marginTop: 15, backgroundColor: "#eee", padding: 10 }}>
          <p>{result.powResult}</p>
          <p>{result.posResult}</p>
          <p>{result.dposResult}</p>
        </div>
        </div>
      )}

      <p
        
    className="consensus-note">

        Click the button to simulate PoW, PoS, and DPoS consensus mechanisms.
        Results will show selected validators based on their metrics.
      </p>
    </div>
    </div>  );
}