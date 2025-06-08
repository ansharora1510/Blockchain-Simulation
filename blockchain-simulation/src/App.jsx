// src/App.jsx
import React from "react";
import BlockSimulation from "./components/BlockSimulation";
import MiningSimulation from "./components/MiningSimulation";
import ConsensusSimulation from "./components/ConsensusSimulation";

export default function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>
        🧱 Blockchain Simulation Dashboard
      </h1>

      <BlockSimulation />
      <MiningSimulation />
      <ConsensusSimulation />

      <footer style={{ textAlign: "center", marginTop: "40px", color: "#1a1a1a" }}>
        <p> Co-Powered by Ansh Arora • Blockchain Mini Project</p>
      </footer>
    </div>
  );
}