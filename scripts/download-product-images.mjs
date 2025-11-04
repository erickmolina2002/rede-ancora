import fs from 'fs'
import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configurações da API
const SSO_URL = "https://sso-catalogo.redeancora.com.br/connect/token"
const API_URL = "https://api-stg-catalogo.redeancora.com.br"
const CLIENT_ID = "652116e6fb024df8b54df7a63079bf25"
const CLIENT_SECRET = "db5917ec73da4773bb47273a738af5cc"

// Diretório onde as imagens serão salvas
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'produtos')

// Criar diretório se não existir
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true })
  console.log(`📁 Diretório criado: ${IMAGES_DIR}`)
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
    console.log('Basic Auth falhou, tentando com credenciais no body...')

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
    }
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

// Função para baixar imagem
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Falha ao baixar imagem: ${response.statusCode}`))
        return
      }

      const fileStream = fs.createWriteStream(filepath)
      response.pipe(fileStream)

      fileStream.on('finish', () => {
        fileStream.close()
        resolve()
      })

      fileStream.on('error', (err) => {
        fs.unlink(filepath, () => {}) // Remove arquivo parcial
        reject(err)
      })
    }).on('error', (err) => {
      reject(err)
    })
  })
}

// Função principal
async function main() {
  try {
    console.log('🔐 Obtendo token de autenticação...')
    const token = await getToken()
    console.log('✅ Token obtido com sucesso!')

    // Placa de exemplo - você pode mudar para qualquer placa
    const placa = 'ABC1234'

    console.log(`\n🔍 Buscando produtos para a placa: ${placa}`)
    const response = await buscarProdutos(token, placa)

    const produtos = response.pageResult?.data || []
    console.log(`📦 Encontrados ${produtos.length} produtos`)

    const imageMap = {}
    let downloadedCount = 0

    for (const item of produtos) {
      const produto = item.data

      if (produto.imagemReal) {
        const imageUrl = produto.imagemReal
        const filename = path.basename(new URL(imageUrl).pathname)
        const filepath = path.join(IMAGES_DIR, filename)

        // Se a imagem já foi baixada, pular
        if (fs.existsSync(filepath)) {
          console.log(`⏭️  Imagem já existe: ${filename}`)
          imageMap[produto.id] = `/images/produtos/${filename}`
          continue
        }

        try {
          console.log(`⬇️  Baixando: ${filename}`)
          await downloadImage(imageUrl, filepath)
          console.log(`✅ Salva: ${filename}`)
          imageMap[produto.id] = `/images/produtos/${filename}`
          downloadedCount++
        } catch (error) {
          console.error(`❌ Erro ao baixar ${filename}:`, error.message)
        }
      }

      // Baixar também imagens dos similares
      if (produto.similares && produto.similares.length > 0) {
        for (const similar of produto.similares) {
          if (similar.imagemReal) {
            const imageUrl = similar.imagemReal
            const filename = path.basename(new URL(imageUrl).pathname)
            const filepath = path.join(IMAGES_DIR, filename)

            if (fs.existsSync(filepath)) {
              console.log(`⏭️  Imagem já existe: ${filename}`)
              imageMap[similar.id] = `/images/produtos/${filename}`
              continue
            }

            try {
              console.log(`⬇️  Baixando similar: ${filename}`)
              await downloadImage(imageUrl, filepath)
              console.log(`✅ Salva: ${filename}`)
              imageMap[similar.id] = `/images/produtos/${filename}`
              downloadedCount++
            } catch (error) {
              console.error(`❌ Erro ao baixar ${filename}:`, error.message)
            }
          }
        }
      }
    }

    // Salvar mapeamento de produtos para imagens
    const mapPath = path.join(IMAGES_DIR, 'image-map.json')
    fs.writeFileSync(mapPath, JSON.stringify(imageMap, null, 2))
    console.log(`\n📝 Mapeamento salvo em: ${mapPath}`)

    console.log(`\n✨ Concluído! ${downloadedCount} novas imagens baixadas.`)
  } catch (error) {
    console.error('❌ Erro:', error.message)
    process.exit(1)
  }
}

main()
