export interface ProdutoFilho {
  id: number
  produtoSistemaId: number | null
  dataModificacao: string
  cna: string
  csa: string
  codigoReferencia: string
  ean: string | null
  marca: string
  nomeProduto: string
  informacoesComplementares: string
  informacoesAdicionais: string
  cnl: string
  pontoCriticoAtencao: string | null
  linkExibicaoVideo: string | null
  dimensoes: string | null
  imagemReal: string | null
  imagemIlustrativa: string | null
}

export interface ProdutoFilhoResponse {
  pageResult: {
    count: number
    data: Array<{
      score: number
      data: ProdutoFilho
      highlights: object
    }>
  }
}

export interface Produto {
  id: number
  dataModificacao: string
  csa: string
  cna: string
  codigoReferencia: string
  ean: string | null
  marca: string
  nomeProduto: string
  informacoesComplementares: string
  pontoCriticoAtencao: string | null
  dimensoes: string | null
  imagemReal: string | null
  imagemIlustrativa: string | null
  preco?: number
  tipoCompatibilidade?: 'original' | 'compativel'
  semEstoque?: boolean
  similares: Array<{
    id: number
    marcaId: number
    marca: string
    codigoReferencia: string
    cna: string
    ean: string | null
    confiavel: boolean
    informacoesAdicionais: string
    informacoesComplementares: string | null
    descontinuado: boolean
  }>
}

export interface SearchV2Response {
  pageResult: {
    count: number
    vehicle: {
      montadora: string
      modelo: string
      versao: string
      chassi: string
      motor: string
      combustivel: string
      cambio: string
      carroceria: string
      anoFabricacao: string
      anoModelo: string
      linha: string
      eixos: string | null
      geracao: string
    }
    data: Produto[]
  }
}

class ApiService {
  // Usar apenas mock - API real removida
  async buscarProdutosFilho(placa: string, nomeFabricante?: string): Promise<ProdutoFilhoResponse> {
    const { mockProdutosFilho } = await import('./mockData')

    let produtosFiltrados = mockProdutosFilho

    if (nomeFabricante) {
      produtosFiltrados = mockProdutosFilho.filter(p =>
        p.marca.toLowerCase().includes(nomeFabricante.toLowerCase())
      )
    }

    return {
      pageResult: {
        count: produtosFiltrados.length,
        data: produtosFiltrados.map(produto => ({
          score: 1.0,
          data: produto,
          highlights: {}
        }))
      }
    }
  }

  async buscarProdutosV2(placa: string, superbusca: string, pagina: number = 0, itensPorPagina: number = 5): Promise<SearchV2Response> {
    const { filterProductsBySearchWithVariations, getVehicleByPlate } = await import('./mockData')

    const produtosFiltrados = filterProductsBySearchWithVariations(superbusca)

    // Implementar paginação
    const inicio = pagina * itensPorPagina
    const fim = inicio + itensPorPagina
    const produtosPaginados = produtosFiltrados.slice(inicio, fim)

    // Seleciona veículo baseado na placa
    const vehicleInfo = getVehicleByPlate(placa)

    return {
      pageResult: {
        count: produtosFiltrados.length,
        vehicle: vehicleInfo,
        data: produtosPaginados
      }
    }
  }

}

export const apiService = new ApiService()
