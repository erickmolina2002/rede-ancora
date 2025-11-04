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
  versao?: string
  chassi: string
  motor: string
  combustivel: string
  cambio: string
  carroceria: string
  anoFabricacao: string
  anoModelo: string
  linha: string
  eixos?: string
  geracao: string
  vehiclePlateLanguageUnderstand?: any
  vehiclePlateGenAI?: any
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
  preco?: number
  tipoCompatibilidade?: 'original' | 'compativel'
  semEstoque?: boolean
  similares: Similar[]
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

interface AuthResponse {
  access_token: string
  expires_in: number
  token_type: string
  scope: string
}

class ApiService {
  private baseUrl = "https://api-stg-catalogo.redeancora.com.br"
  private accessToken: string | null = null
  private tokenExpiry: number | null = null

  private async authenticate(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      // Call our server-side API route instead of SSO directly
      const response = await fetch("/api/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Authentication failed: ${response.status}`)
      }

      const data: AuthResponse = await response.json()

      this.accessToken = data.access_token
      this.tokenExpiry = Date.now() + data.expires_in * 1000 - 60000 // Subtract 1 minute for safety

      return this.accessToken
    } catch (error) {
      throw new Error('Failed to authenticate with API')
    }
  }

  private async makeRequest<T>(endpoint: string, body: object): Promise<T> {
    const token = await this.authenticate()

    console.log('[DEBUG] Endpoint:', `${this.baseUrl}${endpoint}`)
    console.log('[DEBUG] Body enviado:', JSON.stringify(body, null, 2))
    console.log('[DEBUG] Token:', token ? 'Presente' : 'Ausente')

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log('[DEBUG] Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[DEBUG] Error response:', errorText)
      throw new Error(`API request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('[DEBUG] Response data:', JSON.stringify(data, null, 2))

    return data
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
      }
    }

    if (superbusca) {
      body.superbusca = superbusca
    }

    return this.makeRequest<ProdutoFilhoResponse>("/superbusca/api/integracao/catalogo/v2/produtos-filhos/query", body)
  }

  // Busca inicial ao colocar a placa - sem filtro, página 1 com 1 item para pegar info do veículo
  async buscarInformacaoVeiculo(placa: string): Promise<ProdutoFilhoResponse> {
    return this.buscarProdutosFilho(placa, undefined, 1, 1)
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
