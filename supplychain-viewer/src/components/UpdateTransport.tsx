// src/components/UpdateTransport.tsx
import React, { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/ethersConfig";

const UpdateTransport: React.FC<{ productId: number }> = ({ productId }) => {
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");

  const handleUpdateTransport = async () => {
    const contract = getContract();
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();
    const signedContract = contract.connect(signer);

    try {
      const tx = await signedContract.atualizarTransporte(
        productId,
        location,
        status,
        parseInt(estimatedTime)
      );
      await tx.wait();
      alert("Status de transporte atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o transporte:", error);
    }
  };

  return (
    <div>
      <h3>Atualizar Transporte</h3>
      <input
        type="text"
        placeholder="Localização Atual"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="text"
        placeholder="Status do Transporte"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />
      <input
        type="number"
        placeholder="Tempo Estimado (em segundos)"
        value={estimatedTime}
        onChange={(e) => setEstimatedTime(e.target.value)}
      />
      <button onClick={handleUpdateTransport}>Atualizar Transporte</button>
    </div>
  );
};

export default UpdateTransport;
