export const OCORRENCIAS = [
  {
    id: 'apoio_cidadao',
    titulo: 'Apoio ao Cidadão',
    descricao: 'Um idoso precisa de ajuda para atravessar uma avenida movimentada. O trânsito está intenso e ele parece nervoso com o fluxo de veículos.',
    dificuldade: 'Fácil',
    chanceBaseSucesso: 0.95,
    sucesso: {
      xp: 30,
      dinheiro: 80,
      mensagem: 'Você ajudou o cidadão a atravessar com segurança. Ele agradeceu sinceramente pelo seu profissionalismo.'
    },
    falha: {
      xp: -5,
      dinheiro: 0,
      mensagem: 'O trânsito estava muito intenso e você não conseguiu ajudar a tempo. O cidadão encontrou outra forma de atravessar.'
    }
  },
  {
    id: 'furto_veiculo',
    titulo: 'Furto de Veículo',
    descricao: 'Uma denúncia via rádio indica um carro em alta velocidade na zona norte. O veículo corresponde à descrição de um furto ocorrido há minutos.',
    dificuldade: 'Média',
    chanceBaseSucesso: 0.60,
    sucesso: {
      xp: 60,
      dinheiro: 150,
      mensagem: 'Você interceptou o veículo com sucesso! Os suspeitos foram detidos e o carro recuperado.'
    },
    falha: {
      xp: -15,
      dinheiro: 0,
      mensagem: 'O veículo escapou em alta velocidade. Você perdeu a referência no trânsito intenso.'
    }
  },
  {
    id: 'assalto_banco',
    titulo: 'Assalto a Banco',
    descricao: 'Alarmes disparados no centro comercial. Suspeitos armados no local e reféns foram reportados. Requer intervenção imediata e tática.',
    dificuldade: 'Difícil',
    chanceBaseSucesso: 0.30,
    sucesso: {
      xp: 120,
      dinheiro: 300,
      mensagem: 'Operação bem-sucedida! Todos os reféns foram libertados ilesos e os suspeitos foram neutralizados.'
    },
    falha: {
      xp: -30,
      dinheiro: -50,
      mensagem: 'A operação não saiu como planejado. Houve baixas e os suspeitos conseguiram escapar.'
    }
  },
  {
    id: 'perturbacao_sossego',
    titulo: 'Perturbação do Sossego',
    descricao: 'Moradores reclamam de uma festa barulhenta que vai além do horário permitido. O som está muito alto e perturbando o descanso da vizinhança.',
    dificuldade: 'Fácil',
    chanceBaseSucesso: 0.90,
    sucesso: {
      xp: 25,
      dinheiro: 60,
      mensagem: 'Você abordou os responsáveis e eles reduziram o volume imediatamente. A vizinhança agradeceu.'
    },
    falha: {
      xp: -5,
      dinheiro: 0,
      mensagem: 'Os responsáveis não colaboraram e você precisou chamar reforço. A situação foi resolvida, mas demorou mais que o esperado.'
    }
  },
  {
    id: 'acidente_transito',
    titulo: 'Acidente de Trânsito',
    descricao: 'Colisão entre dois veículos na avenida principal. Há vítimas e o trânsito está parado. Precisa organizar o local e socorrer os feridos.',
    dificuldade: 'Média',
    chanceBaseSucesso: 0.75,
    sucesso: {
      xp: 50,
      dinheiro: 120,
      mensagem: 'Você organizou perfeitamente o local do acidente e coordenou o socorro. As vítimas estão bem e o trânsito foi normalizado.'
    },
    falha: {
      xp: -10,
      dinheiro: 0,
      mensagem: 'O local ficou desorganizado e causou mais congestionamento. O socorro demorou a chegar.'
    }
  },
  {
    id: 'drogas_esquina',
    titulo: 'Tráfico de Drogas',
    descricao: 'Informações anônimas indicam atividade de tráfico em uma esquina movimentada. Suspeitos fazem trocas rápidas com veículos em movimento.',
    dificuldade: 'Média',
    chanceBaseSucesso: 0.55,
    sucesso: {
      xp: 80,
      dinheiro: 200,
      mensagem: 'Operação de sucesso! Você prendeu os suspeitos em flagrante e apreendeu uma quantidade significativa de drogas.'
    },
    falha: {
      xp: -20,
      dinheiro: 0,
      mensagem: 'Os suspeitos perceberam sua aproximação e fugiram. Apenas pequenas quantidades foram encontradas no local.'
    }
  },
  {
    id: 'desaparecido',
    titulo: 'Pessoa Desaparecida',
    descricao: 'Uma mãe desesperada procura seu filho de 8 anos que desapareceu no parque há duas horas. A criança tem camiseta vermelha e shorts azuis.',
    dificuldade: 'Fácil',
    chanceBaseSucesso: 0.85,
    sucesso: {
      xp: 40,
      dinheiro: 100,
      mensagem: 'Você encontrou a criança brincando em outra área do parque! A mãe está aliviada e muito grata.'
    },
    falha: {
      xp: -8,
      dinheiro: 0,
      mensagem: 'Após horas de busca, a criança não foi encontrada. Outras unidades foram acionadas para ajudar.'
    }
  },
  {
    id: 'agressao_via_publica',
    titulo: 'Agressão em Via Pública',
    descricao: 'Briga violenta em frente a um bar. Duas pessoas estão feridas e uma terceira armada ameaça os presentes. Requer intervenção imediata.',
    dificuldade: 'Difícil',
    chanceBaseSucesso: 0.35,
    sucesso: {
      xp: 100,
      dinheiro: 250,
      mensagem: 'Você controlou a situação com maestria! Os agressores foram detidos e as vítimas receberam atendimento médico.'
    },
    falha: {
      xp: -25,
      dinheiro: -30,
      mensagem: 'A intervenção foi mal executada. Houve mais feridos e a situação escalou antes da chegada de reforço.'
    }
  },
  {
    id: 'vandalismo',
    titulo: 'Vandalismo',
    descricao: 'Grupo de jovens pichando muros e quebrando vidraças no centro comercial. Eles estão embriagados e se recusam a parar.',
    dificuldade: 'Fácil',
    chanceBaseSucesso: 0.80,
    sucesso: {
      xp: 35,
      dinheiro: 90,
      mensagem: 'Você abordou os jovens e eles foram levados para a delegacia. Os comerciantes agradeceram pela rápida intervenção.'
    },
    falha: {
      xp: -7,
      dinheiro: 0,
      mensagem: 'Os jovens fugiram quando você chegou. Alguns danos foram causados antes que pudesse intervir.'
    }
  },
  {
    id: 'embriaguez_dirigir',
    titulo: 'Embriaguez ao Dirigir',
    descricao: 'Veículo andando de forma errática pela cidade. O motorista parece visivelmente embriagado e representa perigo iminente.',
    dificuldade: 'Média',
    chanceBaseSucesso: 0.70,
    sucesso: {
      xp: 55,
      dinheiro: 140,
      mensagem: 'Você abordou o motorista e o teste de bafômetro confirmou a embriaguez. Ele foi detido antes de causar acidentes.'
    },
    falha: {
      xp: -12,
      dinheiro: 0,
      mensagem: 'O motorista percebeu sua abordagem e acelerou, conseguindo escapar em uma rua lateral.'
    }
  }
]

export function sortearOcorrencia() {
  const indice = Math.floor(Math.random() * OCORRENCIAS.length)
  return OCORRENCIAS[indice]
}

export function calcularResultadoSucesso(ocorrencia, patente, bonusItens = 0) {
  // Bônus baseado na patente
  let bonusPatente = 0
  
  switch (patente) {
    case 'Soldado':
      bonusPatente = 0
      break
    case 'Cabo':
      bonusPatente = 0.05
      break
    case 'Sargento':
      bonusPatente = 0.10
      break
    case 'Subtenente':
      bonusPatente = 0.15
      break
    case 'Aspirante a Oficial':
      bonusPatente = 0.20
      break
    case 'Tenente':
      bonusPatente = 0.25
      break
    case 'Capitão':
      bonusPatente = 0.30
      break
    case 'Major':
      bonusPatente = 0.35
      break
    case 'Tenente-Coronel':
      bonusPatente = 0.40
      break
    case 'Coronel':
      bonusPatente = 0.50
      break
    default:
      bonusPatente = 0
  }
  
  const chanceFinal = Math.min(0.95, ocorrencia.chanceBaseSucesso + bonusPatente + bonusItens)
  return Math.random() < chanceFinal
}

export function getCorDificuldade(dificuldade) {
  switch (dificuldade) {
    case 'Fácil':
      return '#4CAF50' // Verde
    case 'Média':
      return '#FF9800' // Laranja
    case 'Difícil':
      return '#F44336' // Vermelho
    default:
      return '#666'
  }
}
