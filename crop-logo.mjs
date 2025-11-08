import sharp from 'sharp';

const inputImage = 'public/images/rede.jpeg';
const outputImage = 'public/images/rede-2.jpg';

async function cropLogoToSquare() {
  try {
    console.log('Cortando laterais da logo para criar versão quadrada...\n');

    // Obter dimensões da imagem original
    const image = sharp(inputImage);
    const metadata = await image.metadata();

    console.log(`Dimensões originais: ${metadata.width}x${metadata.height}`);

    // A imagem é 650x385, vamos cortar menos para manter mais conteúdo
    // Vamos cortar para aproximadamente 500x385 (corta menos)
    const cropWidth = 500;
    const left = Math.floor((metadata.width - cropWidth) / 2);

    await sharp(inputImage)
      .extract({
        left: left,
        top: 0,
        width: cropWidth,
        height: metadata.height
      })
      .jpeg({
        quality: 95
      })
      .toFile(outputImage);

    console.log(`✅ Logo cortada com sucesso!`);
    console.log(`📁 Localização: ${outputImage}`);
    console.log(`📐 Novas dimensões: ${cropWidth}x${metadata.height} (aproximadamente quadrada)`);
    console.log(`✂️  Cortado ${metadata.width - cropWidth}px das laterais (${left}px de cada lado)`);

  } catch (error) {
    console.error('❌ Erro ao cortar imagem:', error);
    process.exit(1);
  }
}

cropLogoToSquare();
