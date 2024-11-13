// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    
    // Estrutura para armazenar informações do produto, incluindo origem e destino
    struct Produto {
        uint256 id;
        string nome;
        address origem;         // Endereço do fabricante
        address destino;        // Endereço do distribuidor ou cliente final
        address proprietarioAtual;
        string status;
    }

    // Estrutura para acompanhar o status do transporte em tempo real
    struct Transporte {
        uint256 produtoId;
        string localizacaoAtual;
        string statusTransporte; // Ex: "Em transporte", "Entregue"
        uint256 tempoEstimadoEntrega;
    }

    // Estrutura para registrar cada movimentação do produto
    struct Movimentacao {
        uint256 produtoId;
        address de;
        address para;
        uint256 timestamp;
    }

    // Estrutura para registrar condições específicas de transporte (como temperatura e umidade)
    struct Condicao {
        uint256 produtoId;
        int256 temperatura;    // Ex: temperatura em Celsius
        uint256 umidade;       // Ex: umidade em porcentagem
        uint256 timestamp;
    }

    // Mapeamentos para armazenar produtos, transportes, movimentações e condições
    mapping(uint256 => Produto) public produtos;
    mapping(uint256 => Transporte) public transportes;
    mapping(uint256 => Movimentacao[]) public historicoMovimentacoes;
    mapping(uint256 => Condicao[]) public historicoCondicoes;

    // Contador para gerar IDs únicos para produtos
    uint256 public contadorProdutos;

    // Controle de acesso baseado em permissões
    mapping(address => bool) public autorizados;

    // Eventos para registrar ações importantes no contrato
    event ProdutoCriado(uint256 id, string nome, address origem, address destino);
    event AtualizacaoTransporte(uint256 produtoId, string localizacao, string status, uint256 tempoEstimadoEntrega);
    event TransferenciaPosse(uint256 produtoId, address indexed de, address indexed para, uint256 timestamp);
    event CondicaoAtualizada(uint256 produtoId, int256 temperatura, uint256 umidade, uint256 timestamp);

    // Modificador para garantir que apenas partes autorizadas possam executar certas funções
    modifier apenasAutorizado() {
        require(autorizados[msg.sender], "Somente partes autorizadas podem executar essa acao.");
        _;
    }

    // Construtor para definir o endereço do administrador inicial
    constructor() {
        autorizados[msg.sender] = true; // O deployer do contrato é automaticamente autorizado
    }

    // Função para autorizar um novo participante na rede
    function autorizarParticipante(address participante) public apenasAutorizado {
        autorizados[participante] = true;
    }

    // Função para criar um novo produto e registrar sua origem e destino
    function criarProduto(string memory nome, address destino) public apenasAutorizado {
        require(destino != address(0), "Endereco de destino invalido.");
        contadorProdutos++;
        produtos[contadorProdutos] = Produto(contadorProdutos, nome, msg.sender, destino, msg.sender, "Criado");
        emit ProdutoCriado(contadorProdutos, nome, msg.sender, destino);
    }

    // Função para atualizar o status do transporte de um produto
    function atualizarTransporte(uint256 produtoId, string memory localizacaoAtual, string memory statusTransporte, uint256 tempoEstimadoEntrega) public apenasAutorizado {
        require(produtos[produtoId].proprietarioAtual == msg.sender, "Apenas o proprietario atual pode atualizar o transporte.");
        transportes[produtoId] = Transporte(produtoId, localizacaoAtual, statusTransporte, tempoEstimadoEntrega);
        emit AtualizacaoTransporte(produtoId, localizacaoAtual, statusTransporte, tempoEstimadoEntrega);
    }

    // Função para transferir a posse de um produto para um novo proprietário
    function transferirPosse(uint256 produtoId, address novoProprietario) public apenasAutorizado {
        require(produtos[produtoId].proprietarioAtual == msg.sender, "Apenas o proprietario atual pode transferir a posse.");
        historicoMovimentacoes[produtoId].push(Movimentacao(produtoId, msg.sender, novoProprietario, block.timestamp));
        produtos[produtoId].proprietarioAtual = novoProprietario;
        emit TransferenciaPosse(produtoId, msg.sender, novoProprietario, block.timestamp);
    }

    // Função para atualizar as condições de transporte (ex.: temperatura, umidade)
    function atualizarCondicao(uint256 produtoId, int256 temperatura, uint256 umidade) public apenasAutorizado {
        historicoCondicoes[produtoId].push(Condicao(produtoId, temperatura, umidade, block.timestamp));
        emit CondicaoAtualizada(produtoId, temperatura, umidade, block.timestamp);
    }

    // Função para visualizar o histórico completo de movimentações de um produto
    function verHistoricoMovimentacao(uint256 produtoId) public view returns (Movimentacao[] memory) {
        return historicoMovimentacoes[produtoId];
    }

    // Função para visualizar o histórico de condições específicas de um produto
    function verHistoricoCondicoes(uint256 produtoId) public view returns (Condicao[] memory) {
        return historicoCondicoes[produtoId];
    }
}
