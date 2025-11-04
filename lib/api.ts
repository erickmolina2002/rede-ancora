// API utilities for Ancora catalog integration

export interface AuthResponse {
  access_token: string
  expires_in: number
  token_type: string
}

export interface Familia {
  id: number
  descricao: string
  subFamilia: {
    id: number
    descricao: string
    produtoTipo: string | null
  }
}

export interface Similar {
  id: number
  marcaId: number
  marca: string
  logoMarca: string
  codigoReferencia: string
  cna: string
  ean: string | null
  confiavel: boolean
  cnl: string
  linkExibicaoVideo: string | null
  linkExibicaoVideoEmbed: string
  informacoesAdicionais: string
  informacoesComplementares: string | null
  descontinuado: boolean
  imagemReal: string
}

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
  familia?: Familia
  imagensTecnicas: string[]
  produtosParcialmenteSimilares: any[]
  similares: Similar[]
}

export interface VehicleInfo {
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
  eixos: string
  geracao: string
  vehiclePlateLanguageUnderstand?: string
}

export interface ProdutoFilhoResponse {
  pageResult: {
    count: number
    vehicle?: VehicleInfo
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

export function getProductImageUrl(product: Produto | ProdutoFilho): string {
  const imagePath = product.imagemReal || product.imagemIlustrativa

  if (!imagePath || imagePath.trim() === '') {
    return '/placeholder.svg?height=400&width=400'
  }

  // Se já for uma URL completa (http/https), extrair o nome do arquivo e usar a versão local
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    try {
      const url = new URL(imagePath)
      const filename = url.pathname.split('/').pop()
      if (filename) {
        return `/images/produtos/${filename}`
      }
    } catch (e) {
      return imagePath
    }
    return imagePath
  }

  // Se começar com /, é um caminho local - usar diretamente
  if (imagePath.startsWith('/')) {
    return imagePath
  }

  // Caso contrário, é um nome de arquivo - usar a pasta local
  return `/images/produtos/${imagePath}`
}

class ApiService {
  private baseUrl = "https://api-stg-catalogo.redeancora.com.br"
  private accessToken: string | null = null
  private tokenExpiry: number | null = null

  private async authenticate(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      console.log("[v0] Using cached token")
      return this.accessToken
    }

    try {
      console.log("[v0] Requesting new token from server...")

      // Call our server-side API route instead of SSO directly
      const response = await fetch("/api/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Token request failed:", response.status, errorText)
        throw new Error(`Authentication failed: ${response.status}`)
      }

      const data: AuthResponse = await response.json()
      console.log("[v0] Token received, expires in:", data.expires_in, "seconds")

      this.accessToken = data.access_token
      this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000 // Subtract 1 minute for safety

      return this.accessToken
    } catch (error) {
      console.error("[v0] Authentication error:", error)
      throw new Error("Failed to authenticate with API")
    }
  }

  private async makeRequest<T>(endpoint: string, body: object): Promise<T> {
    const token = await this.authenticate()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    return response.json()
  }

  async buscarProdutosFilho(
    placa: string,
    superbusca?: string,
    pagina = 1,
    itensPorPagina = 5
  ): Promise<ProdutoFilhoResponse> {
    const body: Record<string, any> = {
      veiculoFiltro: {
        veiculoPlaca: placa,
      },
      pagina,
      itensPorPagina,
    }

    if (superbusca) {
      body.superbusca = superbusca
    }

    return this.makeRequest<ProdutoFilhoResponse>("/superbusca/api/integracao/catalogo/v2/produtos-filhos/query", body)
  }

  // Busca inicial ao colocar a placa - sem filtro, página 0
  async buscarInformacaoVeiculo(placa: string): Promise<ProdutoFilhoResponse> {
    return this.buscarProdutosFilho(placa, undefined, 0, 0)
  }

  async buscarProdutosV2(
    placa: string,
    superbusca: string,
    pagina = 0,
    itensPorPagina = 20,
  ): Promise<SearchV2Response> {
    const body = {
      veiculoFiltro: {
        veiculoPlaca: placa,
      },
      superbusca,
      pagina,
      itensPorPagina,
    }

    return this.makeRequest<SearchV2Response>("/superbusca/api/integracao/catalogo/v2/produtos/query/sumario", body)
  }

  async buscarProdutos(superbusca: string, pagina = 0, itensPorPagina = 20): Promise<SearchV2Response> {
    const body = {
      superbusca,
      pagina,
      itensPorPagina,
    }

    return this.makeRequest<SearchV2Response>("/superbusca/api/integracao/catalogo/v2/produtos/query/sumario", body)
  }
}

export const apiService = new ApiService()

// Mock data for fallback
export const MOCK_PRODUCTS: Produto[] = [
  {
    id: 1,
    csa: "FL001",
    cna: "FL001",
    codigoReferencia: "W950/26",
    marca: "Mann Filter",
    nomeProduto: "Filtro de Óleo Mann W950/26",
    informacoesComplementares: "Filtro de óleo de alta qualidade",
    pontoCriticoAtencao: null,
    dimensoes: null,
    imagemReal: null,
    imagemIlustrativa: null,
    dataModificacao: new Date().toISOString(),
    ean: null,
    similares: [],
  },
  {
    id: 2,
    csa: "VL002",
    cna: "VL002",
    codigoReferencia: "BKR6E",
    marca: "NGK",
    nomeProduto: "Vela de Ignição NGK BKR6E",
    informacoesComplementares: "Vela de ignição premium",
    pontoCriticoAtencao: null,
    dimensoes: null,
    imagemReal: null,
    imagemIlustrativa: null,
    dataModificacao: new Date().toISOString(),
    ean: null,
    similares: [],
  },
]
