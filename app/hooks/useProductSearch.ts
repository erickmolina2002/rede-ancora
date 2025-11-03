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

  // Função para buscar informações do veículo direto do mock
  const buscarInformacoesVeiculo = useCallback(async (placa: string) => {
    console.log('[BUSCA VEICULO] Buscando informacoes para placa:', placa)

    try {
      // Busca direta no mock - sempre retorna dados
      const response = await apiService.buscarProdutosV2(placa, 'filtro', 0, 1)

      if (response?.pageResult?.vehicle) {
        console.log('[BUSCA VEICULO] Informacoes do veiculo carregadas')
        setState(prev => ({
          ...prev,
          veiculoInfo: response.pageResult.vehicle
        }))
        return response.pageResult.vehicle
      }
    } catch (error) {
      console.log('[BUSCA VEICULO] Erro ao buscar:', error)
    }

    return null
  }, [])

  // Buscar produtos filhos baseado na placa para gerar array de nomes
  const buscarProdutosFilho = useCallback(async (placa: string) => {
    if (!placa.trim()) return

    try {
      // Buscar produtos filhos do mock - sem loading state
      const response = await apiService.buscarProdutosFilho(placa)

      const produtosFilho = response.pageResult.data.map(item => item.data)
      const nomesProdutos = [...new Set(
        produtosFilho.map(produto => produto.nomeProduto.trim())
      )].filter(nome => nome.length > 0)

      // Buscar informações do veículo direto do mock
      await buscarInformacoesVeiculo(placa)

      setState(prev => ({
        ...prev,
        isLoading: false,
        produtosFilho,
        nomesProdutos,
        hasSearched: true
      }))

    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao buscar produtos.',
        hasSearched: true
      }))
    }
  }, [buscarInformacoesVeiculo])

  // Buscar produtos usando Search V2 com superbusca
  const buscarProdutos = useCallback(async (
    placa: string,
    termoBusca: string,
    pagina: number = 0,
    itensPorPagina: number = 5
  ) => {
    if (!placa.trim() || !termoBusca.trim()) return

    try {
      // Busca direta no mock - sem loading state
      const response = await apiService.buscarProdutosV2(placa, termoBusca, pagina, itensPorPagina)

      setState(prev => ({
        ...prev,
        isLoading: false,
        produtosEncontrados: response.pageResult.data,
        veiculoInfo: response.pageResult.vehicle,
        hasSearched: true
      }))

    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao buscar produtos.',
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
