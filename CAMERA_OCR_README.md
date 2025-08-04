# Camera Component com OCR Real

## Resumo das Melhorias

O componente `CameraInput` foi aprimorado com as seguintes funcionalidades:

### ✅ Implementações Concluídas:

1. **Layout Simples Original** - Voltou ao design original mais limpo
2. **Tesseract.js Integrado** - OCR real para detecção de placas de veículos  
3. **Retângulo de Escaneamento** - Área clara e visível no centro da câmera
4. **Detecção Automática** - Escaneamento contínuo a cada 2 segundos
5. **Processamento Inteligente** - Reconhece formatos de placa brasileiros (ABC-1234, ABC-1D23)

### 🔧 Funcionalidades Técnicas:

- **OCR Worker**: Tesseract.js configurado para reconhecer apenas letras, números e hífen
- **Processamento de Texto**: Algoritmo inteligente para extrair e formatar placas
- **Validação**: Integração com a função existente `validateLicensePlate`
- **Auto-preenchimento**: Preenche automaticamente o input quando detecta placa válida
- **Cleanup**: Limpa recursos da câmera e worker OCR automaticamente

### 📱 Interface do Usuário:

- Modal simples com fundo branco
- Vídeo da câmera com overlay do retângulo de escaneamento
- Indicadores visuais nos cantos do retângulo
- Linha de escaneamento animada durante o processo
- Botão "Cancelar" para entrada manual

### 🚀 Como Usar:

```tsx
<CameraInput
  value={plateValue}
  onChange={setPlateValue}
  placeholder="ABC-1234"
  label="Placa do Veículo"
/>
```

### 🎯 Configurações OCR:

- **Linguagem**: Inglês (eng) - adequado para placas alphanuméricas
- **Caracteres Permitidos**: A-Z, 0-9, hífen
- **Modo de Segmentação**: 8 (palavra única)
- **Confiança Mínima**: 60%
- **Intervalo de Escaneamento**: 2 segundos

### 📋 Formatos de Placa Suportados:

- **Padrão Antigo**: ABC-1234
- **Mercosul**: ABC-1D23  
- **Formato Alternativo**: AB-1234

O componente detecta automaticamente estes padrões e formata corretamente.