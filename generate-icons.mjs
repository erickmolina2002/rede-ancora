import fetch from 'node-fetch'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const imageUrl = 'https://cdn.bitrix24.com.br/b13589949/landing/77f/77f9503f0e1c3c922d71a6806d08b413/Sem-titulo-2_1x.png' // imagem PNG da internet
const outputDir = path.resolve('public')
const tempImage = path.resolve('temp-logo.png')
const sizes = [16, 32]

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

const downloadImage = async (url, dest) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Erro ao baixar imagem: ${res.statusText}`)
  const buffer = await res.buffer()
  fs.writeFileSync(dest, buffer)
}

const generateIcons = async () => {
  await downloadImage(imageUrl, tempImage)
  await Promise.all(
    sizes.map(size =>
      sharp(tempImage)
        .resize(size, size)
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`))
    )
  )
  fs.unlinkSync(tempImage)
  console.log('✅ Ícones gerados com sucesso em public/icons/')
}

generateIcons().catch(err => console.error('Erro:', err))
