// Sistema de Jogo - Turnos e Iniciativa

export const FASES_JOGO = {
  PREPARACAO: 'preparacao',
  INICIATIVA: 'iniciativa',
  ACAO_JOGADOR: 'acao_jogador',
  ACAO_IA: 'acao_ia',
  RESOLUCAO: 'resolucao',
  NARRATIVA: 'narrativa'
}

export const TIPOS_ACAO = {
  MOVIMENTO: 'movimento',
  TESTE_PERICIA: 'teste_pericia',
  ATAQUE: 'ataque',
  INTERACAO: 'interacao',
  USAR_ITEM: 'usar_item',
  FALAR: 'falar'
}

export function calcularIniciativa(personagem) {
  // 1d20 + modificador de Destreza
  const modDES = Math.floor((personagem.atributos.DES - 10) / 2)
  return Math.floor(Math.random() * 20) + 1 + modDES
}

export function criarTurno(personagem, inimigos = []) {
  const iniciativaJogador = calcularIniciativa(personagem)
  const iniciativasInimigos = inimigos.map(inimigo => ({
    ...inimigo,
    iniciativa: calcularIniciativa(inimigo)
  }))
  
  const todos = [
    { ...personagem, tipo: 'jogador', iniciativa: iniciativaJogador },
    ...iniciativasInimigos
  ].sort((a, b) => b.iniciativa - a.iniciativa)
  
  return {
    ordem: todos,
    atual: 0,
    fase: FASES_JOGO.INICIATIVA,
    rodada: 1
  }
}

export function proximoTurno(turno) {
  const proximo = turno.atual + 1
  
  if (proximo >= turno.ordem.length) {
    // Nova rodada
    return {
      ...turno,
      atual: 0,
      rodada: turno.rodada + 1,
      fase: FASES_JOGO.INICIATIVA
    }
  }
  
  return {
    ...turno,
    atual: proximo,
    fase: FASES_JOGO.ACAO_JOGADOR
  }
}

export function getPersonagemAtual(turno) {
  return turno.ordem[turno.atual]
}

export function criarAcao(tipo, dados, personagem) {
  return {
    id: Date.now() + Math.random(),
    tipo,
    dados,
    personagem: personagem.nome,
    timestamp: Date.now(),
    resolvido: false
  }
}

export function criarTestePericia(pericia, dificuldade, personagem) {
  const modAtributo = Math.floor((personagem.atributos[personagem.pericias[pericia]?.atributo || 'INT'] - 10) / 2)
  const bonusPericia = personagem.pericias[pericia] || 0
  const bonusTotal = modAtributo + bonusPericia
  
  const dado = Math.floor(Math.random() * 20) + 1
  const resultado = dado + bonusTotal
  
  return {
    tipo: TIPOS_ACAO.TESTE_PERICIA,
    pericia,
    dificuldade,
    dado,
    bonusTotal,
    resultado,
    sucesso: resultado >= dificuldade,
    critico: dado === 20,
    falhaCritica: dado === 1
  }
}

export function criarCena(titulo, descricao, opcoes = [], personagens = []) {
  return {
    id: Date.now(),
    titulo,
    descricao,
    opcoes,
    personagens,
    acoes: [],
    estado: 'ativa'
  }
}

export function criarEscolha(texto, consequencias, teste = null) {
  return {
    id: Date.now() + Math.random(),
    texto,
    consequencias,
    teste,
    escolhida: false
  }
}

// Sistema de narrativa
export function gerarDescricaoCena(tipoCena, personagem, contexto) {
  const descricoes = {
    investigacao: [
      ${personagem.nome} chega ao local do crime. A cena é caótica, com evidências espalhadas por toda parte.,
      O ambiente está frio e silencioso.  observa cuidadosamente cada detalhe.,
      Luzes de emergência piscam enquanto  começa a investigação.
    ],
    interrogatorio: [
      A sala de interrogatório é pequena e opressiva.  se senta frente ao suspeito.,
      O suspeito parece nervoso.  prepara as perguntas cuidadosamente.,
      A tensão no ar é palpável.  começa o interrogatório.
    ],
    acao: [
      A situação se intensifica rapidamente.  precisa agir agora!,
      Adrenalina corre pelas veias de . O momento da verdade chegou.,
      Tudo acontece em fração de segundos.  reage instintivamente.
    ],
    negociacao: [
      A negociação começa.  avalia cada palavra cuidadosamente.,
      O ambiente está tenso.  tenta encontrar uma solução pacífica.,
      Cada gesto é importante.  mantém a calma sob pressão.
    ]
  }
  
  const descricoesTipo = descricoes[tipoCena] || descricoes.investigacao
  return descricoesTipo[Math.floor(Math.random() * descricoesTipo.length)]
}

export function processarEscolha(escolha, personagem) {
  if (escolha.teste) {
    const resultado = criarTestePericia(
      escolha.teste.pericia,
      escolha.teste.dificuldade,
      personagem
    )
    
    return {
      sucesso: resultado.sucesso,
      descricao: resultado.sucesso 
        ? escolha.consequencias.sucesso 
        : escolha.consequencias.falha,
      teste: resultado
    }
  }
  
  return {
    sucesso: true,
    descricao: escolha.consequencias.sucesso,
    teste: null
  }
}
