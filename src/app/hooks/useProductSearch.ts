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
    anoFabricacao: string;
    anoModelo: string;
    motor: string;
    combustivel: string;
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

  // Buscar produtos filhos baseado na placa para gerar array de nomes
  const buscarProdutosFilho = useCallback(async (placa: string) => {
    if (!placa.trim()) return

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await apiService.buscarProdutosFilho(placa)
      
      if (response.pageResult.count === 0) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Nenhum produto encontrado para esta placa.',
          produtosFilho: [],
          nomesProdutos: [],
          hasSearched: true
        }))
        return
      }

      const produtosFilho = response.pageResult.data.map(item => item.data)
      const nomesProdutos = [...new Set(
        produtosFilho.map(produto => produto.nomeProduto.trim())
      )].filter(nome => nome.length > 0)

      setState(prev => ({
        ...prev,
        isLoading: false,
        produtosFilho,
        nomesProdutos,
        hasSearched: true
      }))

    } catch (error) {
      console.error('Erro ao buscar produtos filhos:', error)
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Erro ao buscar produtos. Tente novamente.',
        hasSearched: true
      }))
    }
  }, [])

  // Buscar produtos usando Search V2 com superbusca
  const buscarProdutos = useCallback(async (
    placa: string, 
    termoBusca: string, 
    pagina: number = 0,
    itensPorPagina: number = 5
  ) => {
    if (!placa.trim() || !termoBusca.trim()) return

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await apiService.buscarProdutosV2(placa, termoBusca, pagina, itensPorPagina)
      
      if (response.pageResult.count === 0) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Nenhum produto encontrado para esta busca.',
          produtosEncontrados: [],
          hasSearched: true
        }))
        return
      }

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
        error: 'Erro ao buscar produtos. Tente novamente.',
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
    buscarSugestoes,
    encontrarMelhorMatch,
    resetSearch
  }
}