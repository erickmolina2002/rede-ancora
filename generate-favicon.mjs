import sharp from 'sharp';
import { writeFileSync } from 'fs';

const inputLogo = 'public/images/ancora-logo-new.png';

async function generateFavicon() {
  try {
    console.log('Gerando favicon.ico da Rede Âncora...\n');

    // Gerar ícone 32x32 como base para o favicon
    const faviconBuffer = await sharp(inputLogo)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .png()
      .toBuffer();

    // Salvar como PNG (navegadores modernos aceitam PNG como favicon)
    writeFileSync('public/favicon.png', faviconBuffer);
    console.log('✓ Gerado: favicon.png (32x32)');

    // Também criar versão ICO (formato tradicional)
    // Como sharp não suporta ICO diretamente, vamos criar múltiplos tamanhos em PNG
    const sizes = [16, 32, 48];

    for (const size of sizes) {
      const buffer = await sharp(inputLogo)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        })
        .png()
        .toBuffer();

      writeFileSync(`public/favicon-${size}x${size}.png`, buffer);
      console.log(`✓ Gerado: favicon-${size}x${size}.png`);
    }

    // Copiar o favicon 32x32 como favicon.ico (navegadores aceitam PNG renomeado)
    writeFileSync('public/favicon.ico', faviconBuffer);
    console.log('✓ Gerado: favicon.ico (formato PNG 32x32)');

    console.log('\n✅ Favicon gerado com sucesso!');
    console.log('📁 Localização: public/favicon.ico');
  } catch (error) {
    console.error('❌ Erro ao gerar favicon:', error);
    process.exit(1);
  }
}

generateFavicon();
