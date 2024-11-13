// src/utils/ethersConfig.ts
import { ethers } from "ethers";
import SupplyChainABI from "../abis/SupplyChain.json";

console.log(process.env.REACT_APP_SEPOLIA_URL);
console.log(process.env.REACT_APP_CONTRACT_ADDRESS);

export const getContract = () => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.REACT_APP_SEPOLIA_URL
  );
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS || "";
  return new ethers.Contract(contractAddress, SupplyChainABI, provider);
};
