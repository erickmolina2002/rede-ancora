export interface AuthResponse {
  access_token: string
  expires_in: number
  token_type: string
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
  private baseUrl: string = process.env.API_BASE_URL || 'https://api-stg-catalogo.redeancora.com.br'
  private ssoUrl: string = process.env.SSO_BASE_URL || 'https://sso-catalogo.redeancora.com.br'
  private clientId: string = process.env.CLIENT_ID || '65tvh6rvn4d7uer3hqqm2p8k2pvnm5wx'
  private clientSecret: string = process.env.CLIENT_SECRET || '9Gt2dBRFTUgunSeRPqEFxwNgAfjNUPLP5EBvXKCn'
  private accessToken: string | null = null
  private tokenExpiry: number | null = null

  private async authenticate(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken
    }

    try {
      const response = await fetch(`${this.ssoUrl}/connect/token`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'client_credentials',
        }),
      })

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.status}`)
      }

      const data: AuthResponse = await response.json()
      this.accessToken = data.access_token
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000 // Subtract 1 minute for safety

      return this.accessToken
    } catch (error) {
      console.error('Authentication error:', error)
      throw new Error('Failed to authenticate with API')
    }
  }

  private async makeRequest<T>(endpoint: string, body: object): Promise<T> {
    const token = await this.authenticate()
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`)
    }

    return response.json()
  }

  async buscarProdutosFilho(placa: string, nomeFabricante?: string): Promise<ProdutoFilhoResponse> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body: Record<string, any> = {
      veiculoFiltro: {
        veiculoPlaca: placa
      },
      pagina: 0,
      itensPorPagina: 100
    }
    console.log(body)

    if (nomeFabricante) {
      body.produtoFiltro = {
        nomeFabricante
      }
    }

    return this.makeRequest<ProdutoFilhoResponse>(
      '/superbusca/api/integracao/catalogo/v2/produtos-filhos/query',
      body
    )
  }

  async buscarProdutosV2(placa: string, superbusca: string, pagina: number = 0, itensPorPagina: number = 5): Promise<SearchV2Response> {
    const body = {
      veiculoFiltro: {
        veiculoPlaca: placa
      },
      superbusca,
      pagina,
      itensPorPagina
    }

    return this.makeRequest<SearchV2Response>(
      '/superbusca/api/integracao/catalogo/v2/produtos/query/sumario',
      body
    )
  }
}

export const apiService = new ApiService()