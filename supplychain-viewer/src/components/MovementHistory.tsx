// src/components/MovementHistory.tsx
import React, { useState, useEffect } from "react";
import { getContract } from "../utils/ethersConfig";

const MovementHistory: React.FC<{ productId: number }> = ({ productId }) => {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const contract = getContract();
      const historyData = await contract.verHistoricoMovimentacao(productId);
      setHistory(historyData);
    };
    fetchHistory();
  }, [productId]);

  return (
    <div>
      <h3>Histórico de Movimentação</h3>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            De: {entry.de} Para: {entry.para} - Data:{" "}
            {new Date(entry.timestamp * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MovementHistory;
