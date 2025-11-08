import sharp from 'sharp';

const inputImage = 'public/images/rede.jpeg';
const outputImage = 'public/images/rede.png';

async function convertToPngWithTransparency() {
  try {
    console.log('Convertendo rede.jpeg para PNG removendo fundo azul escuro...\n');

    // Ler a imagem
    const image = sharp(inputImage);

    // Converter para PNG e remover fundo azul escuro
    await image
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
      .then(({ data, info }) => {
        // Processar pixels para tornar azuis escuros transparentes
        const pixels = new Uint8Array(data);

        for (let i = 0; i < pixels.length; i += info.channels) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];

          // Detectar azul escuro (baixo R e G, qualquer B)
          // Ajuste esses valores conforme necessário para pegar o azul do fundo
          const isBlueBackground = (
            r < 80 &&   // Vermelho baixo
            g < 80 &&   // Verde baixo
            b < 150     // Azul pode ser um pouco mais alto, mas ainda escuro
          );

          // Se for o fundo azul escuro, torná-lo transparente
          if (isBlueBackground) {
            pixels[i + 3] = 0; // Define alpha como 0 (transparente)
          }
        }

        return sharp(pixels, {
          raw: {
            width: info.width,
            height: info.height,
            channels: info.channels
          }
        })
        .png()
        .toFile(outputImage);
      });

    console.log('✅ Imagem convertida com sucesso!');
    console.log('📁 Localização: public/images/rede.png');
    console.log('\nO fundo azul escuro foi removido e substituído por transparência.');

  } catch (error) {
    console.error('❌ Erro ao converter imagem:', error);
    process.exit(1);
  }
}

convertToPngWithTransparency();
