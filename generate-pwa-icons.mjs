import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { join } from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputLogo = 'public/images/rede.png';
const outputDir = 'public/icons';

async function generateIcons() {
  try {
    // Criar diretório se não existir
    await mkdir(outputDir, { recursive: true });

    console.log('Gerando ícones PWA do Ancora Express...\n');

    for (const size of sizes) {
      const outputPath = join(outputDir, `icon-${size}x${size}.png`);

      await sharp(inputLogo)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 0 }
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Gerado: icon-${size}x${size}.png`);
    }

    // Gerar ícones menores para favicon
    await sharp(inputLogo)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(join(outputDir, 'icon-16x16.png'));
    console.log('✓ Gerado: icon-16x16.png');

    await sharp(inputLogo)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(join(outputDir, 'icon-32x32.png'));
    console.log('✓ Gerado: icon-32x32.png');

    // Gerar favicon.ico (apenas copiamos o 32x32)
    await sharp(inputLogo)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile('public/favicon-32x32.png');

    console.log('\n✅ Todos os ícones foram gerados com sucesso!');
    console.log('📁 Localização: public/icons/');
  } catch (error) {
    console.error('❌ Erro ao gerar ícones:', error);
    process.exit(1);
  }
}

generateIcons();
