import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configurações da API
const SSO_URL = "https://sso-catalogo.redeancora.com.br/connect/token"
const API_URL = "https://api-stg-catalogo.redeancora.com.br"
const CLIENT_ID = "652116e6fb024df8b54df7a63079bf25"
const CLIENT_SECRET = "db5917ec73da4773bb47273a738af5cc"

// Categorias mapeadas
const CATEGORY_MAP = {
  'FILTRO': 'combustivel',
  'VELA': 'injecao',
  'PASTILHA': 'abrantes',
  'DISCO': 'abrantes',
  'AMORTECEDOR': 'abrantes',
  'CORREIA': 'motores',
  'BOMBA': 'motores',
  'KIT': 'motores',
  'BATERIA': 'injecao',
  'CABO': 'injecao',
  'FLANGE': 'motores',
  'CONJUNTO': 'motores',
}

function getCategoryFromName(name) {
  const upperName = name.toUpperCase()
  for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
    if (upperName.includes(keyword)) {
      return category
    }
  }
  return 'motores' // default
}

function generateRandomPrice(base = 100) {
  return Number((base + Math.random() * base * 2).toFixed(2))
}

// Função para obter token
async function getToken() {
  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')

  const formData = new URLSearchParams()
  formData.append('grant_type', 'client_credentials')

  const response = await fetch(SSO_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': `Basic ${basicAuth}`
    },
    body: formData
  })

  const text = await response.text()

  if (!response.ok && text.includes('invalid_client')) {
    const formDataWithCreds = new URLSearchParams()
    formDataWithCreds.append('client_id', CLIENT_ID)
    formDataWithCreds.append('client_secret', CLIENT_SECRET)
    formDataWithCreds.append('grant_type', 'client_credentials')

    const response2 = await fetch(SSO_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: formDataWithCreds
    })

    const text2 = await response2.text()

    if (!response2.ok) {
      throw new Error(`Erro ao obter token: ${response2.status} - ${text2}`)
    }

    const data2 = JSON.parse(text2)
    return data2.access_token
  }

  if (!response.ok) {
    throw new Error(`Erro ao obter token: ${response.status} - ${text}`)
  }

  const data = JSON.parse(text)
  return data.access_token
}

// Função para buscar produtos
async function buscarProdutos(token, placa) {
  const url = `${API_URL}/superbusca/api/integracao/catalogo/v2/produtos-filhos/query`

  const body = {
    veiculoFiltro: {
      veiculoPlaca: placa
    },
    pagina: 1,
    itensPorPagina: 12
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new Error(`Erro ao buscar produtos: ${response.statusText}`)
  }

  return await response.json()
}

// Função para extrair filename da URL
function getFilenameFromUrl(url) {
  if (!url) return null
  try {
    const urlObj = new URL(url)
    return urlObj.pathname.split('/').pop()
  } catch (e) {
    return null
  }
}

// Função principal
async function main() {
  try {
    console.log('🔐 Obtendo token de autenticação...')
    const token = await getToken()
    console.log('✅ Token obtido!')

    // Buscar produtos de múltiplas placas para ter mais variedade
    const placas = ['ABC1234', 'DEF5678', 'GHI9012']
    let allProdutos = []

    for (const placa of placas) {
      console.log(`\n🔍 Buscando produtos para a placa: ${placa}`)
      const response = await buscarProdutos(token, placa)
      const produtos = response.pageResult?.data || []
      console.log(`📦 Encontrados ${produtos.length} produtos`)
      allProdutos = allProdutos.concat(produtos)
    }

    // Remover duplicados por ID
    const uniqueProdutos = []
    const seenIds = new Set()

    for (const item of allProdutos) {
      if (!seenIds.has(item.data.id)) {
        seenIds.add(item.data.id)
        uniqueProdutos.push(item)
      }
    }

    const produtos = uniqueProdutos.slice(0, 12) // Limitar a 12 produtos
    console.log(`\n📊 Total de produtos únicos: ${produtos.length}`)

    // Gerar array de mocks
    const mockProducts = []

    produtos.forEach((item, index) => {
      const produto = item.data
      const filename = getFilenameFromUrl(produto.imagemReal)
      const imagePath = filename ? `/images/produtos/${filename}` : '/placeholder.svg?height=200&width=200'

      const basePrice = 50 + (index * 30)
      const price = generateRandomPrice(basePrice)
      const hasDiscount = Math.random() > 0.5
      const originalPrice = hasDiscount ? Number((price * 1.3).toFixed(2)) : undefined
      const discount = hasDiscount ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined

      const mock = {
        id: produto.id,
        name: produto.nomeProduto,
        image: imagePath,
        price: price,
        ...(hasDiscount && { originalPrice, discount }),
        inStock: true,
        category: getCategoryFromName(produto.nomeProduto),
        marca: produto.marca,
        codigoReferencia: produto.codigoReferencia,
        estoque: Math.floor(Math.random() * 30) + 5,
        dimensoes: produto.dimensoes || 'N/A',
        informacoesComplementares: produto.informacoesComplementares || `${produto.nomeProduto} - Produto de alta qualidade.`,
      }

      mockProducts.push(mock)
    })

    // Gerar código TypeScript
    const tsCode = `// Mock products data - Generated from API
// Last updated: ${new Date().toISOString()}

export interface MockProduct {
  id: number
  name: string
  image: string
  price: number
  originalPrice?: number
  discount?: number
  inStock: boolean
  category?: string
  marca?: string
  codigoReferencia?: string
  estoque?: number
  dimensoes?: string
  informacoesComplementares?: string
}

export const MOCK_PRODUCTS: MockProduct[] = ${JSON.stringify(mockProducts, null, 2)}

// Função helper para buscar produto por ID
export const getProductById = (id: number): MockProduct | undefined => {
  return MOCK_PRODUCTS.find(product => product.id === id)
}

// Função helper para buscar produtos por nome (busca)
export const searchProducts = (query: string): MockProduct[] => {
  const lowerQuery = query.toLowerCase()
  return MOCK_PRODUCTS.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.marca?.toLowerCase().includes(lowerQuery) ||
    product.codigoReferencia?.toLowerCase().includes(lowerQuery)
  )
}

// Função helper para pegar produtos em destaque
export const getFeaturedProducts = (count: number = 2): MockProduct[] => {
  return MOCK_PRODUCTS.filter(p => p.discount).slice(0, count)
}

// Função helper para pegar produtos recentes
export const getRecentProducts = (count: number = 6): MockProduct[] => {
  return MOCK_PRODUCTS.slice(2, 2 + count)
}
`

    // Salvar arquivo
    const outputPath = path.join(__dirname, '..', 'lib', 'mockProducts.ts')
    fs.writeFileSync(outputPath, tsCode, 'utf8')

    console.log(`\n✅ Mock gerado com sucesso!`)
    console.log(`📁 Arquivo: ${outputPath}`)
    console.log(`📊 Total de produtos: ${mockProducts.length}`)

    // Mostrar resumo dos primeiros 3 produtos
    console.log(`\n📦 Primeiros produtos gerados:`)
    mockProducts.slice(0, 3).forEach(p => {
      console.log(`  - ${p.name} (${p.marca}) - R$ ${p.price.toFixed(2)}`)
    })

  } catch (error) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }
}

main()
