export const ITENS = [
  {
    id: 'colete_nivel_2',
    nome: 'Colete Nível II',
    descricao: 'Colete balístico avançado que aumenta sua proteção em ocorrências de risco',
    preco: 500,
    icone: '🦺',
    categoria: 'protecao',
    bonus: {
      tipo: 'chance_sucesso',
      valor: 0.10, // +10% de chance de sucesso
      aplicacao: 'todas'
    }
  },
  {
    id: 'viatura_sedan',
    nome: 'Viatura Sedan',
    descricao: 'Veículo rápido e eficiente que reduz o tempo de patrulha',
    preco: 2000,
    icone: '🚗',
    categoria: 'veiculo',
    bonus: {
      tipo: 'reducao_tempo',
      valor: 2, // Reduz 2 segundos do tempo de patrulha
      aplicacao: 'patrulha'
    }
  },
  {
    id: 'algemas_aco',
    nome: 'Algemas de Aço',
    descricao: 'Algemas reforçadas que garantem melhor controle em prisões',
    preco: 300,
    icone: '⛓️',
    categoria: 'equipamento',
    bonus: {
      tipo: 'bonus_xp',
      valor: 0.05, // +5% XP em ocorrências de prisão
      aplicacao: 'prisao'
    }
  },
  {
    id: 'radio_avancado',
    nome: 'Rádio Avançado',
    descricao: 'Sistema de comunicação que libera ocorrências de alto valor',
    preco: 1500,
    icone: '📻',
    categoria: 'comunicacao',
    bonus: {
      tipo: 'liberar_ocorrencias',
      valor: 'dificeis', // Libera ocorrências difíceis
      aplicacao: 'sorteio'
    }
  },
  {
    id: 'kit_primeiros_socorros',
    nome: 'Kit Primeiros Socorros',
    descricao: 'Equipamento médico para reduzir penalidades em falhas',
    preco: 400,
    icone: '🏥',
    categoria: 'medico',
    bonus: {
      tipo: 'reducao_penalidade',
      valor: 0.50, // Reduz 50% das penalidades de XP
      aplicacao: 'falha'
    }
  },
  {
    id: 'lanterna_tatica',
    nome: 'Lanterna Tática',
    descricao: 'Iluminação potente para operações noturnas',
    preco: 250,
    icone: '🔦',
    categoria: 'equipamento',
    bonus: {
      tipo: 'chance_sucesso',
      valor: 0.05, // +5% de chance de sucesso
      aplicacao: 'noturnas'
    }
  },
  {
    id: 'cassetete',
    nome: 'Cassetete',
    descricao: 'Equipamento de defesa pessoal para confrontos',
    preco: 200,
    icone: '🔨',
    categoria: 'arma',
    bonus: {
      tipo: 'chance_sucesso',
      valor: 0.03, // +3% de chance de sucesso
      aplicacao: 'confronto'
    }
  },
  {
    id: 'uniforme_tatico',
    nome: 'Uniforme Tático',
    descricao: 'Uniforme especial que melhora sua aparência profissional',
    preco: 800,
    icone: '👔',
    categoria: 'cosmetico',
    bonus: {
      tipo: 'cosmetico',
      valor: 'cor_nome_dourada', // Muda cor do nome no chat
      aplicacao: 'visual'
    }
  }
]

// Itens Premium (futuramente para assinantes)
export const ITENS_PREMIUM = [
  {
    id: 'viatura_interceptacao',
    nome: 'Viatura de Intercepção (ROTA)',
    descricao: 'Veículo de alta performance exclusivo para membros ROTA',
    preco: 5000,
    icone: '🚓',
    categoria: 'veiculo',
    premium: true,
    bonus: {
      tipo: 'reducao_tempo',
      valor: 4, // Reduz 4 segundos
      aplicacao: 'patrulha'
    }
  },
  {
    id: 'uniforme_gala',
    nome: 'Uniforme de Gala',
    descricao: 'Uniforme especial para cerimônias e eventos oficiais',
    preco: 3000,
    icone: '🎖️',
    categoria: 'cosmetico',
    premium: true,
    bonus: {
      tipo: 'cosmetico',
      valor: 'cor_nome_platina', // Cor platina no chat
      aplicacao: 'visual'
    }
  }
]

export function getItemById(id) {
  return ITENS.find(item => item.id === id) || ITENS_PREMIUM.find(item => item.id === id)
}

export function getItensByCategoria(categoria) {
  return ITENS.filter(item => item.categoria === categoria)
}

export function calcularBonusTotais(inventario) {
  const bonusTotais = {
    chance_sucesso: 0,
    reducao_tempo: 0,
    bonus_xp: 0,
    reducao_penalidade: 0,
    ocorrencias_liberadas: [],
    cosmeticos: []
  }

  inventario.forEach(itemId => {
    const item = getItemById(itemId)
    if (!item || !item.bonus) return

    const { tipo, valor } = item.bonus

    switch (tipo) {
      case 'chance_sucesso':
        bonusTotais.chance_sucesso += valor
        break
      case 'reducao_tempo':
        bonusTotais.reducao_tempo += valor
        break
      case 'bonus_xp':
        bonusTotais.bonus_xp += valor
        break
      case 'reducao_penalidade':
        bonusTotais.reducao_penalidade += valor
        break
      case 'liberar_ocorrencias':
        bonusTotais.ocorrencias_liberadas.push(valor)
        break
      case 'cosmetico':
        bonusTotais.cosmeticos.push(valor)
        break
    }
  })

  return bonusTotais
}
