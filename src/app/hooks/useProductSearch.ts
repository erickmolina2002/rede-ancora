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

  // Função auxiliar para buscar informações do veículo
  const buscarInformacoesVeiculo = useCallback(async (placa: string) => {
    const termosComuns = ['filtro', 'oleo', 'pastilha', 'disco', 'vela', 'freio', 'correia']
    
    for (const termo of termosComuns) {
      try {
        console.log(`Tentando buscar informações do veículo com termo: ${termo}`)
        const response = await apiService.buscarProdutosV2(placa, termo, 0, 1)
        console.log('Resposta da API SearchV2:', response.pageResult)
        if (response.pageResult.vehicle) {
          console.log('Informações do veículo encontradas:', response.pageResult.vehicle)
          setState(prev => ({
            ...prev,
            veiculoInfo: response.pageResult.vehicle
          }))
          return response.pageResult.vehicle
        }
      } catch (error) {
        console.log(`Erro ao buscar com termo ${termo}:`, error)
        continue // Tenta o próximo termo
      }
    }
    return null
  }, [])

  // Buscar produtos filhos baseado na placa para gerar array de nomes
  const buscarProdutosFilho = useCallback(async (placa: string) => {
    if (!placa.trim()) return

    setState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Primeiro buscar produtos filhos
      const response = await apiService.buscarProdutosFilho(placa)
      
      if (response.pageResult.count === 0) {
        setState(prev => ({
          ...prev,
          isLoading: true, // Manter loading ativo
          error: null,
          produtosFilho: [],
          nomesProdutos: [],
          hasSearched: false // Não marcar como pesquisado
        }))
        return
      }

      const produtosFilho = response.pageResult.data.map(item => item.data)
      const nomesProdutos = [...new Set(
        produtosFilho.map(produto => produto.nomeProduto.trim())
      )].filter(nome => nome.length > 0)

      // Buscar informações do veículo usando a função auxiliar
      if (nomesProdutos.length > 0) {
        // Primeiro tenta com o produto encontrado
        try {
          const vehicleResponse = await apiService.buscarProdutosV2(placa, nomesProdutos[0], 0, 1)
          if (vehicleResponse.pageResult.vehicle) {
            setState(prev => ({
              ...prev,
              veiculoInfo: vehicleResponse.pageResult.vehicle
            }))
          }
        } catch {
          // Se falhar, usa a função auxiliar com termos comuns
          await buscarInformacoesVeiculo(placa)
        }
      } else {
        // Se não tem produtos, usa a função auxiliar
        await buscarInformacoesVeiculo(placa)
      }

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
  }, [buscarInformacoesVeiculo])

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
          isLoading: true, // Manter loading ativo
          error: null,
          produtosEncontrados: [],
          hasSearched: false // Não marcar como pesquisado
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
    buscarInformacoesVeiculo,
    buscarSugestoes,
    encontrarMelhorMatch,
    resetSearch
  }
}