import { ethers } from "hardhat";

async function main() {
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();

  // Substitua `deployed()` por `waitForDeployment()`
  await supplyChain.waitForDeployment();

  console.log("SupplyChain deployed to:", supplyChain.target); // use `target` ao invés de `address` com ethers v6
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
