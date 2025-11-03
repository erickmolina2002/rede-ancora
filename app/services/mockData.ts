import { Produto, ProdutoFilho } from './apiService'

// Dados mockados de produtos automotivos
export const mockProdutos: Produto[] = [
  {
    id: 1,
    dataModificacao: '2024-01-15',
    csa: 'CSA001',
    cna: 'CNA001',
    codigoReferencia: 'FL-001',
    ean: '7891234567890',
    marca: 'TECFIL',
    nomeProduto: 'FILTRO DE ÓLEO',
    informacoesComplementares: 'Filtro de óleo para motores 1.0 a 2.0',
    pontoCriticoAtencao: null,
    dimensoes: '10x10x15cm',
    imagemReal: '/products/filtro-oleo.svg',
    imagemIlustrativa: '/products/filtro-oleo.svg',
    similares: []
  },
  {
    id: 2,
    dataModificacao: '2024-01-15',
    csa: 'CSA002',
    cna: 'CNA002',
    codigoReferencia: 'PA-001',
    ean: '7891234567892',
    marca: 'BOSCH',
    nomeProduto: 'PASTILHA DE FREIO DIANTEIRA',
    informacoesComplementares: 'Pastilha de freio cerâmica alta performance',
    pontoCriticoAtencao: 'Verificar compatibilidade com disco',
    dimensoes: '15x8x2cm',
    imagemReal: '/products/pastilha-freio.svg',
    imagemIlustrativa: '/products/pastilha-freio.svg',
    similares: []
  },
  {
    id: 3,
    dataModificacao: '2024-01-15',
    csa: 'CSA003',
    cna: 'CNA003',
    codigoReferencia: 'FA-001',
    ean: '7891234567893',
    marca: 'TECFIL',
    nomeProduto: 'FILTRO DE AR',
    informacoesComplementares: 'Filtro de ar de alta eficiência',
    pontoCriticoAtencao: null,
    dimensoes: '25x20x5cm',
    imagemReal: '/products/filtro-ar.svg',
    imagemIlustrativa: '/products/filtro-ar.svg',
    similares: []
  },
  {
    id: 4,
    dataModificacao: '2024-01-15',
    csa: 'CSA004',
    cna: 'CNA004',
    codigoReferencia: 'VE-001',
    ean: '7891234567894',
    marca: 'NGK',
    nomeProduto: 'VELA DE IGNIÇÃO',
    informacoesComplementares: 'Vela de ignição platinada',
    pontoCriticoAtencao: 'Respeitar torque de aperto',
    dimensoes: '5x5x10cm',
    imagemReal: '/products/vela.svg',
    imagemIlustrativa: '/products/vela.svg',
    similares: []
  },
  {
    id: 5,
    dataModificacao: '2024-01-15',
    csa: 'CSA005',
    cna: 'CNA005',
    codigoReferencia: 'CO-001',
    ean: '7891234567895',
    marca: 'GATES',
    nomeProduto: 'CORREIA DENTADA',
    informacoesComplementares: 'Kit completo com tensor',
    pontoCriticoAtencao: 'Substituir a cada 60.000km',
    dimensoes: '30x15x5cm',
    imagemReal: '/products/correia.svg',
    imagemIlustrativa: '/products/correia.svg',
    similares: []
  },
  {
    id: 6,
    dataModificacao: '2024-01-15',
    csa: 'CSA006',
    cna: 'CNA006',
    codigoReferencia: 'DI-001',
    ean: '7891234567896',
    marca: 'FREMAX',
    nomeProduto: 'DISCO DE FREIO DIANTEIRO',
    informacoesComplementares: 'Disco ventilado',
    pontoCriticoAtencao: null,
    dimensoes: '28x28x3cm',
    imagemReal: '/products/disco-freio.svg',
    imagemIlustrativa: '/products/disco-freio.svg',
    similares: []
  },
  {
    id: 7,
    dataModificação: '2024-01-15',
    csa: 'CSA007',
    cna: 'CNA007',
    codigoReferencia: 'AM-001',
    ean: '7891234567897',
    marca: 'COFAP',
    nomeProduto: 'AMORTECEDOR DIANTEIRO',
    informacoesComplementares: 'Amortecedor à gás',
    pontoCriticoAtencao: 'Substituir em pares',
    dimensoes: '50x10x10cm',
    imagemReal: '/products/amortecedor.svg',
    imagemIlustrativa: '/products/amortecedor.svg',
    similares: []
  },
  {
    id: 8,
    dataModificacao: '2024-01-15',
    csa: 'CSA008',
    cna: 'CNA008',
    codigoReferencia: 'BA-001',
    ean: '7891234567898',
    marca: 'MOURA',
    nomeProduto: 'BATERIA 60AH',
    informacoesComplementares: 'Bateria selada 12V',
    pontoCriticoAtencao: 'Verificar polaridade',
    dimensoes: '24x17x19cm',
    imagemReal: '/products/bateria.svg',
    imagemIlustrativa: '/products/bateria.svg',
    similares: []
  },
  {
    id: 9,
    dataModificacao: '2024-01-15',
    csa: 'CSA009',
    cna: 'CNA009',
    codigoReferencia: 'LA-001',
    ean: '7891234567899',
    marca: 'OSRAM',
    nomeProduto: 'LÂMPADA H4',
    informacoesComplementares: 'Lâmpada halógena 55W',
    pontoCriticoAtencao: 'Não tocar no vidro',
    dimensoes: '5x5x8cm',
    imagemReal: '/products/lampada.svg',
    imagemIlustrativa: '/products/lampada.svg',
    similares: []
  },
  {
    id: 10,
    dataModificacao: '2024-01-15',
    csa: 'CSA010',
    cna: 'CNA010',
    codigoReferencia: 'PA-002',
    ean: '7891234567900',
    marca: 'BOSCH',
    nomeProduto: 'PALHETA LIMPADOR',
    informacoesComplementares: 'Par de palhetas 18"',
    pontoCriticoAtencao: null,
    dimensoes: '45x5x3cm',
    imagemReal: '/products/palheta.svg',
    imagemIlustrativa: '/products/palheta.svg',
    similares: []
  }
]

export const mockProdutosFilho: ProdutoFilho[] = mockProdutos.map((produto, index) => ({
  id: produto.id,
  produtoSistemaId: produto.id,
  dataModificacao: produto.dataModificacao,
  cna: produto.cna,
  csa: produto.csa,
  codigoReferencia: produto.codigoReferencia,
  ean: produto.ean,
  marca: produto.marca,
  nomeProduto: produto.nomeProduto,
  informacoesComplementares: produto.informacoesComplementares,
  informacoesAdicionais: `Produto número ${index + 1}`,
  cnl: `CNL${String(index + 1).padStart(3, '0')}`,
  pontoCriticoAtencao: produto.pontoCriticoAtencao,
  linkExibicaoVideo: null,
  dimensoes: produto.dimensoes,
  imagemReal: produto.imagemReal,
  imagemIlustrativa: produto.imagemIlustrativa
}))

// Array com 10 veículos diversos para mock
export const mockVehicles = [
  {
    montadora: 'VOLKSWAGEN',
    modelo: 'GOL',
    versao: '1.0 MI 8V FLEX 4P MANUAL',
    chassi: '9BWAA05U7ET123456',
    motor: 'EA111 1.0 8V',
    combustivel: 'FLEX',
    cambio: 'MANUAL',
    carroceria: 'HATCH',
    anoFabricacao: '2023',
    anoModelo: '2024',
    linha: 'GOL',
    eixos: '2',
    geracao: 'G8'
  },
  {
    montadora: 'FIAT',
    modelo: 'ARGO',
    versao: '1.3 FIREFLY FLEX 4P MANUAL',
    chassi: '8AP35UF70MT456789',
    motor: 'FIREFLY 1.3 8V',
    combustivel: 'FLEX',
    cambio: 'MANUAL',
    carroceria: 'HATCH',
    anoFabricacao: '2022',
    anoModelo: '2023',
    linha: 'ARGO',
    eixos: '2',
    geracao: '1ª GERAÇÃO'
  },
  {
    montadora: 'CHEVROLET',
    modelo: 'ONIX',
    versao: '1.0 TURBO FLEX PREMIER AUTOMÁTICO',
    chassi: '9BGRZ48T0MB789012',
    motor: 'TURBO 1.0 12V',
    combustivel: 'FLEX',
    cambio: 'AUTOMÁTICO',
    carroceria: 'HATCH',
    anoFabricacao: '2024',
    anoModelo: '2024',
    linha: 'ONIX',
    eixos: '2',
    geracao: '2ª GERAÇÃO'
  },
  {
    montadora: 'TOYOTA',
    modelo: 'COROLLA',
    versao: '2.0 XEI 16V FLEX AUTOMÁTICO',
    chassi: 'ZN1BMAJ16N0345678',
    motor: '2ZR-FE 2.0 16V',
    combustivel: 'FLEX',
    cambio: 'CVT',
    carroceria: 'SEDAN',
    anoFabricacao: '2023',
    anoModelo: '2024',
    linha: 'COROLLA',
    eixos: '2',
    geracao: '12ª GERAÇÃO'
  },
  {
    montadora: 'HYUNDAI',
    modelo: 'HB20',
    versao: '1.0 TGDI FLEX EVOLUTION AUTOMÁTICO',
    chassi: 'HMJ8GH4C1LC901234',
    motor: 'KAPPA 1.0 TURBO',
    combustivel: 'FLEX',
    cambio: 'AUTOMÁTICO',
    carroceria: 'HATCH',
    anoFabricacao: '2023',
    anoModelo: '2023',
    linha: 'HB20',
    eixos: '2',
    geracao: '2ª GERAÇÃO'
  },
  {
    montadora: 'HONDA',
    modelo: 'CIVIC',
    versao: '2.0 SPORT 16V FLEX AUTOMÁTICO',
    chassi: '93HFC2650MZ567890',
    motor: 'R20A 2.0 16V',
    combustivel: 'FLEX',
    cambio: 'CVT',
    carroceria: 'SEDAN',
    anoFabricacao: '2024',
    anoModelo: '2024',
    linha: 'CIVIC',
    eixos: '2',
    geracao: '11ª GERAÇÃO'
  },
  {
    montadora: 'RENAULT',
    modelo: 'KWID',
    versao: '1.0 12V SCE FLEX INTENSE MANUAL',
    chassi: '93YBRH1K0MM234567',
    motor: 'SCE 1.0 12V',
    combustivel: 'FLEX',
    cambio: 'MANUAL',
    carroceria: 'HATCH',
    anoFabricacao: '2023',
    anoModelo: '2024',
    linha: 'KWID',
    eixos: '2',
    geracao: 'FACELIFT'
  },
  {
    montadora: 'JEEP',
    modelo: 'COMPASS',
    versao: '1.3 T270 TURBO FLEX LONGITUDE 4X2',
    chassi: 'ZN1BUHE46M0678901',
    motor: 'GSE T4 1.3 TURBO',
    combustivel: 'FLEX',
    cambio: 'AUTOMÁTICO',
    carroceria: 'SUV',
    anoFabricacao: '2024',
    anoModelo: '2024',
    linha: 'COMPASS',
    eixos: '2',
    geracao: 'MP/552'
  },
  {
    montadora: 'FORD',
    modelo: 'RANGER',
    versao: '3.0 V6 TURBO DIESEL XLT 4X4 CD',
    chassi: '8AFAR22R1LJ345678',
    motor: 'POWER STROKE 3.0 V6',
    combustivel: 'DIESEL',
    cambio: 'AUTOMÁTICO',
    carroceria: 'PICKUP',
    anoFabricacao: '2023',
    anoModelo: '2024',
    linha: 'RANGER',
    eixos: '2',
    geracao: '4ª GERAÇÃO'
  },
  {
    montadora: 'NISSAN',
    modelo: 'KICKS',
    versao: '1.6 16V FLEX S DIRECT CVT',
    chassi: '3N1CN8AV6ML901234',
    motor: 'HR16DE 1.6 16V',
    combustivel: 'FLEX',
    cambio: 'CVT',
    carroceria: 'SUV',
    anoFabricacao: '2024',
    anoModelo: '2024',
    linha: 'KICKS',
    eixos: '2',
    geracao: '2ª GERAÇÃO'
  }
]

// Função para selecionar veículo aleatório
export function getVehicleByPlate(placa: string): typeof mockVehicles[0] {
  // Seleciona um veículo aleatório a cada chamada
  const randomIndex = Math.floor(Math.random() * mockVehicles.length)
  return mockVehicles[randomIndex]
}

// Mantém compatibilidade com código existente
export const mockVehicleInfo = mockVehicles[0]

// Função auxiliar para filtrar produtos por termo de busca
export function filterProductsBySearch(termo: string): Produto[] {
  if (!termo || termo.trim() === '') {
    return mockProdutos
  }

  const termoLower = termo.toLowerCase()
  return mockProdutos.filter(produto =>
    produto.nomeProduto.toLowerCase().includes(termoLower) ||
    produto.marca.toLowerCase().includes(termoLower) ||
    produto.codigoReferencia.toLowerCase().includes(termoLower)
  )
}

// Gerar variações de um produto (original + paralelos/compatíveis)
function gerarVariacoesProduto(produtoBase: Produto): Produto[] {
  const variacoes: Produto[] = []
  const numVariacoes = 4 // Sempre 4 variações

  // Marcas alternativas por tipo de produto
  const marcasAlternativas: { [key: string]: string[] } = {
    'FILTRO': ['TECFIL', 'MANN', 'WEG', 'MAHLE'],
    'PASTILHA': ['BOSCH', 'FRAS-LE', 'JURID', 'TRW'],
    'VELA': ['NGK', 'BOSCH', 'DENSO', 'CHAMPION'],
    'CORREIA': ['GATES', 'CONTINENTAL', 'DAYCO', 'GOODYEAR'],
    'DISCO': ['FREMAX', 'VENTISOL', 'TRW', 'BOSCH'],
    'AMORTECEDOR': ['COFAP', 'MONROE', 'NAKATA', 'VIEMAR'],
    'BATERIA': ['MOURA', 'HELIAR', 'CRAL', 'DUNCAN'],
    'LÂMPADA': ['OSRAM', 'PHILIPS', 'BOSCH', 'GE'],
    'PALHETA': ['BOSCH', 'DYNA', 'TRICO', 'CONTINENTAL']
  }

  // Detectar tipo de produto
  let tipoProduto = 'FILTRO'
  for (const tipo of Object.keys(marcasAlternativas)) {
    if (produtoBase.nomeProduto.toUpperCase().includes(tipo)) {
      tipoProduto = tipo
      break
    }
  }

  const marcas = marcasAlternativas[tipoProduto] || ['GENERICO']

  for (let i = 0; i < numVariacoes; i++) {
    const isOriginal = i === 0
    const marca = marcas[i % marcas.length]

    // Variação de preço: original mais caro, compatível mais barato com variação
    let precoBase = 100 + Math.random() * 300
    if (isOriginal) {
      precoBase = precoBase * 1.4 // Original 40% mais caro
    } else {
      // Compatíveis com preços variados (50% a 80% do preço base)
      precoBase = precoBase * (0.5 + (Math.random() * 0.3))
    }

    variacoes.push({
      ...produtoBase,
      id: produtoBase.id * 1000 + i,
      marca: marca,
      codigoReferencia: `${produtoBase.codigoReferencia}-${i}`,
      preco: Math.round(precoBase * 100) / 100,
      tipoCompatibilidade: isOriginal ? 'original' : 'compativel',
      semEstoque: isOriginal && Math.random() > 0.5 // 50% chance do original estar sem estoque
    })
  }

  // Ordenar: original sempre primeiro, depois por preço decrescente
  return variacoes.sort((a, b) => {
    if (a.tipoCompatibilidade === 'original') return -1
    if (b.tipoCompatibilidade === 'original') return 1
    return (b.preco || 0) - (a.preco || 0)
  })
}

// Função que retorna produtos com variações
export function filterProductsBySearchWithVariations(termo: string): Produto[] {
  const produtosBase = filterProductsBySearch(termo)
  const produtosComVariacoes: Produto[] = []

  produtosBase.forEach(produto => {
    const variacoes = gerarVariacoesProduto(produto)
    produtosComVariacoes.push(...variacoes)
  })

  return produtosComVariacoes
}
