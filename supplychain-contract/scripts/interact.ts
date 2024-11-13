import { ethers } from "hardhat";
import { JsonRpcProvider, Wallet } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS || "";
  const sepoliaUrl = process.env.SEPOLIA_URL || "";
  const privateKey = process.env.PRIVATE_KEY || "";

  // Provedor externo para evitar problemas com o HardhatEthersProvider
  const provider = new JsonRpcProvider(sepoliaUrl);
  const wallet = new Wallet(privateKey, provider);

  // Obtenha a instância do contrato usando o Hardhat para obter o ABI, mas conecte com o Wallet
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = new ethers.Contract(
    contractAddress,
    SupplyChain.interface,
    wallet
  );

  // 1. Criar Produto
  async function criarProduto(nome: string, destino: string) {
    console.log(`Criando produto: ${nome}...`);
    const tx = await supplyChain.criarProduto(nome, destino);
    await tx.wait();
    console.log(
      `Produto criado com sucesso! Nome: ${nome}, Destino: ${destino}`
    );
  }

  // 2. Atualizar Status do Transporte
  async function atualizarTransporte(
    produtoId: number,
    localizacaoAtual: string,
    statusTransporte: string,
    tempoEstimadoEntrega: number
  ) {
    console.log(`Atualizando transporte para o produto ID: ${produtoId}...`);
    const tx = await supplyChain.atualizarTransporte(
      produtoId,
      localizacaoAtual,
      statusTransporte,
      tempoEstimadoEntrega
    );
    await tx.wait();
    console.log(
      `Status de transporte atualizado com sucesso para o produto ID: ${produtoId}`
    );
  }

  // 3. Transferir Posse
  async function transferirPosse(produtoId: number, novoProprietario: string) {
    console.log(
      `Transferindo posse do produto ID: ${produtoId} para novo proprietário: ${novoProprietario}...`
    );
    const tx = await supplyChain.transferirPosse(produtoId, novoProprietario);
    await tx.wait();
    console.log(
      `Posse transferida com sucesso para o produto ID: ${produtoId}`
    );
  }

  // 4. Atualizar Condição de Transporte
  async function atualizarCondicao(
    produtoId: number,
    temperatura: number,
    umidade: number
  ) {
    console.log(`Atualizando condição do produto ID: ${produtoId}...`);
    const tx = await supplyChain.atualizarCondicao(
      produtoId,
      temperatura,
      umidade
    );
    await tx.wait();
    console.log(
      `Condição atualizada com sucesso para o produto ID: ${produtoId}`
    );
  }

  // 5. Visualizar Histórico de Movimentação
  async function verHistoricoMovimentacao(produtoId: number) {
    console.log(
      `Visualizando histórico de movimentação para o produto ID: ${produtoId}...`
    );
    const historico = await supplyChain.verHistoricoMovimentacao(produtoId);
    console.log("Histórico de Movimentação:", historico);
  }

  // 6. Visualizar Histórico de Condições
  async function verHistoricoCondicoes(produtoId: number) {
    console.log(
      `Visualizando histórico de condições para o produto ID: ${produtoId}...`
    );
    const condicoes = await supplyChain.verHistoricoCondicoes(produtoId);
    console.log("Histórico de Condições:", condicoes);
  }

  // Chamadas de teste
  await supplyChain.autorizarParticipante(
    "0x941a500b07a07D73983D71DEfB31FcC8300d59c3"
  );
  await criarProduto(
    "Produto de Teste4",
    "0x941a500b07a07D73983D71DEfB31FcC8300d59c3"
  ); // Substitua pelo endereço de destino
  await atualizarTransporte(1, "Localização A", "Em transporte", 1609459200); // Exemplo de timestamp
  await transferirPosse(1, "0x941a500b07a07D73983D71DEfB31FcC8300d59c3"); // Substitua pelo endereço do novo proprietário
  await atualizarCondicao(1, 25, 60); // Temperatura em Celsius, umidade em porcentagem
  await verHistoricoMovimentacao(1);
  await verHistoricoCondicoes(1);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
