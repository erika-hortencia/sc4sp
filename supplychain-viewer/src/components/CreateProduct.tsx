// src/components/CreateProduct.tsx
import React, { useState } from "react";
import { ethers } from "ethers";
import { getContract } from "../utils/ethersConfig";

async function connectWallet() {
  if (window.ethereum) {
    try {
      // Solicite ao usuário para conectar a carteira
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error("Usuário recusou a conexão com a carteira:", error);
    }
  } else {
    console.error("MetaMask não detectado.");
  }
}

const CreateProduct: React.FC = () => {
  connectWallet();
  const [productName, setProductName] = useState("");
  const [destination, setDestination] = useState("");

  const handleCreateProduct = async () => {
    const contract = getContract();
    const signer = new ethers.providers.Web3Provider(
      window.ethereum
    ).getSigner();
    const signedContract = contract.connect(signer);

    try {
      const tx = await signedContract.criarProduto(productName, destination);
      await tx.wait();
      alert("Produto criado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar o produto:", error);
    }
  };

  return (
    <div>
      <h3>Criar Produto</h3>
      <input
        type="text"
        placeholder="Nome do Produto"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Destino"
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
      />
      <button onClick={handleCreateProduct}>Criar Produto</button>
    </div>
  );
};

export default CreateProduct;
