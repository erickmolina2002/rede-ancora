# Ancora Express

Aplicativo mobile-first para mecânicos do Ancora Express, com catálogo de peças, carrinho de compras e geração de orçamentos.

## Funcionalidades

### Autenticação
- Tela de boas-vindas com animações
- Registro em múltiplas etapas
- Login com CPF/CNPJ
- Validação de senha em tempo real

### Marketplace
- Catálogo completo de peças automotivas
- Busca avançada com filtros
- Ofertas em destaque
- Produtos recentes
- Categorias organizadas

### Carrinho & Checkout
- Gerenciamento de quantidades
- Cálculo automático de frete
- Múltiplas formas de pagamento (Cartão e PIX)
- Parcelamento sem juros

### Sistema de Orçamentos
- Fluxo em múltiplas etapas
- **Reconhecimento de placa por câmera** usando OCR
- Busca de peças por placa do veículo
- Seleção de produtos com busca
- Cálculo automático de mão de obra
- Compartilhamento via WhatsApp
- Histórico de orçamentos

### Gerenciamento de Conta
- Perfil do usuário
- Histórico de pedidos com rastreamento
- Favoritos
- Endereços salvos
- Métodos de pagamento

## Integração com API

O aplicativo está integrado com a API de catálogo do Ancora Express:

### Endpoints Disponíveis

**Autenticação:**
\`\`\`
POST https://sso-catalogo.redeancora.com.br/connect/token
\`\`\`

**Busca de Produtos:**
\`\`\`
POST https://api-stg-catalogo.redeancora.com.br/superbusca/api/integracao/catalogo/v2/produtos/query/sumario
\`\`\`

**Busca por Placa:**
\`\`\`json
{
  "veiculoFiltro": {
    "veiculoPlaca": "ABC1234"
  },
  "superbusca": "AMORTECEDOR",
  "pagina": 0,
  "itensPorPagina": 100
}
\`\`\`

### Arquivos de API

- `lib/api.ts` - Funções utilitárias para chamadas à API
- `app/api/auth/token/route.ts` - Endpoint para obter token JWT

## Reconhecimento de Placa

O aplicativo usa **Tesseract.js** para reconhecimento óptico de caracteres (OCR) de placas de veículos:

1. Usuário abre a câmera no fluxo de orçamento
2. Posiciona a placa dentro do quadro guia
3. Captura a imagem
4. OCR processa e extrai o texto da placa
5. Placa é validada e preenchida automaticamente

### Componente de Scanner

`components/license-plate-scanner.tsx` - Componente completo com:
- Acesso à câmera do dispositivo
- Interface visual com guia de posicionamento
- Processamento OCR em tempo real
- Validação de formato de placa brasileira (ABC1234 ou ABC1D23)

## Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Estilização
- **shadcn/ui** - Componentes UI
- **Tesseract.js** - OCR para reconhecimento de placas
- **Lucide React** - Ícones
- **Geist Font** - Tipografia

## Design

- **Cores da marca Ancora:**
  - Azul escuro: `#004D5C` (primary)
  - Vermelho: `#E31E24` (accent)
- **Mobile-first** - Otimizado para dispositivos móveis
- **Animações suaves** - Transições elegantes
- **Interface moderna** - Design profissional e clean

## Instalação

\`\`\`bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar produção
npm start
\`\`\`

## Estrutura de Pastas

\`\`\`
app/
├── welcome/          # Tela de boas-vindas
├── register/         # Registro de usuário
├── login/            # Login
├── home/             # Página inicial
├── catalog/          # Catálogo de produtos
├── product/[id]/     # Detalhes do produto
├── cart/             # Carrinho de compras
├── checkout/         # Checkout
├── budget/           # Sistema de orçamentos
├── account/          # Gerenciamento de conta
└── api/              # API routes

components/
├── ui/               # Componentes shadcn/ui
├── product-card.tsx  # Card de produto
├── bottom-nav.tsx    # Navegação inferior
└── license-plate-scanner.tsx  # Scanner de placas

lib/
└── api.ts            # Utilitários de API
\`\`\`

## Próximos Passos

- [ ] Implementar autenticação real com backend
- [ ] Adicionar persistência de carrinho
- [ ] Integrar gateway de pagamento
- [ ] Adicionar notificações push
- [ ] Implementar modo offline
- [ ] Adicionar analytics

## Licença

Propriedade do Ancora Express - Todos os direitos reservados
