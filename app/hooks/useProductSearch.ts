import { useState, useCallback } from 'react'
import { apiService, ProdutoFilho, Produto } from '../services/apiService'

export interface ProductSearchState {
  isLoading: boolean
  error: string | null
  produtosFilho: ProdutoFilho[]
  produtosEncontrados: Produto[]
  nomesProdutos: string[]
  veiculoInfo: {
    montadora: string;
    modelo: string;
    versao: string;
    chassi: string;
    motor: string;
    combustivel: string;
    cambio: string;
    carroceria: string;
    anoFabricacao: string;
    anoModelo: string;
    linha: string;
    eixos: string | null;
    geracao: string;
  } | null
  hasSearched: boolean
}

export function useProductSearch() {
  const [state, setState] = useState<ProductSearchState>({
    isLoading: false,
    error: null,
    produtosFilho: [],
    produtosEncontrados: [],
    nomesProdutos: [],
    veiculoInfo: null,
    hasSearched: false
  })

  // Função para buscar informações do veículo da API
  const buscarInformacoesVeiculo = useCallback(async (placa: string) => {
    try {
      // Remover caracteres especiais da placa
      const placaLimpa = placa.replace(/[^A-Z0-9]/gi, '').toUpperCase()

      // Busca inicial na API
      const response = await apiService.buscarInformacaoVeiculo(placaLimpa)

      if (response?.pageResult?.vehicle) {
        setState(prev => ({
          ...prev,
          veiculoInfo: response.pageResult.vehicle
        }))
        return response.pageResult.vehicle
      }
    } catch (error) {
      // Silently fail
    }

    return null
  }, [])

  // Buscar produtos filhos baseado na placa para gerar array de nomes
  const buscarProdutosFilho = useCallback(async (placa: string) => {
    if (!placa.trim()) return

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Remover caracteres especiais da placa (deixar apenas letras e números)
      const placaLimpa = placa.replace(/[^A-Z0-9]/gi, '').toUpperCase()

      // Buscar produtos filhos da API - página 1, 100 itens
      const response = await apiService.buscarProdutosFilho(placaLimpa, undefined, 1, 100)

      const produtosFilho = response.pageResult.data.map(item => item.data)

      // Extrair apenas os nomes únicos dos produtos
      const nomesProdutos = [...new Set(
        produtosFilho.map(produto => produto.nomeProduto.trim())
      )].filter(nome => nome.length > 0).sort()

      // Buscar informações do veículo da API (se ainda não tiver)
      if (!state.veiculoInfo && response.pageResult.vehicle) {
        setState(prev => ({
          ...prev,
          veiculoInfo: response.pageResult.vehicle || null
        }))
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        produtosFilho,
        nomesProdutos,
        hasSearched: true
      }))

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao buscar produtos. Por favor, tente novamente.',
        hasSearched: true
      }))
    }
  }, [])

  // Buscar produtos usando Search V2 com superbusca
  const buscarProdutos = useCallback(async (
    placa: string,
    termoBusca: string,
    pagina: number = 1,
    itensPorPagina: number = 5
  ) => {
    if (!placa.trim() || !termoBusca.trim()) return

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Remover caracteres especiais da placa
      const placaLimpa = placa.replace(/[^A-Z0-9]/gi, '').toUpperCase()

      // Busca na API real usando produtos-filhos/query
      const response = await apiService.buscarProdutosFilho(placaLimpa, termoBusca, pagina, itensPorPagina)

      // Converter ProdutoFilho para Produto
      const produtos: Produto[] = response.pageResult.data.map(item => ({
        id: item.data.id,
        dataModificacao: item.data.dataModificacao,
        csa: item.data.csa,
        cna: item.data.cna,
        codigoReferencia: item.data.codigoReferencia,
        ean: item.data.ean,
        marca: item.data.marca,
        nomeProduto: item.data.nomeProduto,
        informacoesComplementares: item.data.informacoesComplementares,
        pontoCriticoAtencao: item.data.pontoCriticoAtencao,
        dimensoes: item.data.dimensoes,
        imagemReal: item.data.imagemReal,
        imagemIlustrativa: item.data.imagemIlustrativa,
        similares: item.data.similares || []
      }))

      setState(prev => ({
        ...prev,
        isLoading: false,
        produtosEncontrados: produtos,
        veiculoInfo: response.pageResult.vehicle || prev.veiculoInfo,
        hasSearched: true
      }))

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao buscar produtos. Por favor, tente novamente.',
        hasSearched: true
      }))
    }
  }, [])

  // Função para buscar sugestões baseadas no array de nomes
  const buscarSugestoes = useCallback((termo: string): string[] => {
    if (!termo.trim() || state.nomesProdutos.length === 0) {
      return []
    }

    const termoLower = termo.toLowerCase()
    return state.nomesProdutos
      .filter(nome => nome.toLowerCase().includes(termoLower))
      .slice(0, 5) // Limitar a 5 sugestões
  }, [state.nomesProdutos])

  // Função para encontrar o melhor match no array de nomes
  const encontrarMelhorMatch = useCallback((termo: string): string | null => {
    if (!termo.trim() || state.nomesProdutos.length === 0) {
      return null
    }

    const termoLower = termo.toLowerCase()

    // Primeiro: busca por correspondência exata
    const matchExato = state.nomesProdutos.find(nome =>
      nome.toLowerCase() === termoLower
    )
    if (matchExato) return matchExato

    // Segundo: busca por início da palavra
    const matchInicio = state.nomesProdutos.find(nome =>
      nome.toLowerCase().startsWith(termoLower)
    )
    if (matchInicio) return matchInicio

    // Terceiro: busca por conteúdo
    const matchConteudo = state.nomesProdutos.find(nome =>
      nome.toLowerCase().includes(termoLower)
    )
    if (matchConteudo) return matchConteudo

    return null
  }, [state.nomesProdutos])

  // Reset do estado
  const resetSearch = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      produtosFilho: [],
      produtosEncontrados: [],
      nomesProdutos: [],
      veiculoInfo: null,
      hasSearched: false
    })
  }, [])

  return {
    ...state,
    buscarProdutosFilho,
    buscarProdutos,
    buscarInformacoesVeiculo,
    buscarSugestoes,
    encontrarMelhorMatch,
    resetSearch
  }
}
