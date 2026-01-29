// Sistema de Personagem RPG - Mesa Narrativa

export const ATRIBUTOS = {
  FOR: { nome: 'Força', abrev: 'FOR', descricao: 'Poder físico e capacidade de carga' },
  DES: { nome: 'Destreza', abrev: 'DES', descricao: 'Agilidade, reflexos e coordenação' },
  CON: { nome: 'Constituição', abrev: 'CON', descricao: 'Resistência e vitalidade' },
  INT: { nome: 'Inteligência', abrev: 'INT', descricao: 'Raciocínio e conhecimento' },
  SAB: { nome: 'Sabedoria', abrev: 'SAB', descricao: 'Percepção e intuição' },
  CAR: { nome: 'Carisma', abrev: 'CAR', descricao: 'Liderança e persuasão' }
}

export const CLASSES = {
  DETETIVE: {
    nome: 'Detetive',
    descricao: 'Especialista em investigação e dedução',
    atributosPrimarios: ['INT', 'SAB'],
    atributosSecundarios: ['CAR', 'DES'],
    pericias: ['Investigação', 'Interrogatório', 'Percepção', 'Lógica'],
    equipamentoInicial: ['Lupa', 'Bloco de notas', 'Câmera', 'Crachá']
  },
  OFICIAL: {
    nome: 'Oficial de Polícia',
    descricao: 'Agente de campo com treinamento tático',
    atributosPrimarios: ['FOR', 'CON'],
    atributosSecundarios: ['DES', 'CAR'],
    pericias: ['Combate', 'Intimidação', 'Primeiros Socorros', 'Condução'],
    equipamentoInicial: ['Arma de serviço', 'Colete', 'Rádio', 'Algemas']
  },
  PERITO: {
    nome: 'Perito Criminal',
    descricao: 'Especialista em análise forense',
    atributosPrimarios: ['INT', 'DES'],
    atributosSecundarios: ['SAB', 'CON'],
    pericias: ['Forense', 'Química', 'Biologia', 'Tecnologia'],
    equipamentoInicial: ['Kit forense', 'Microscópio', 'Tablet', 'Luvas']
  },
  NEGOCIADOR: {
    nome: 'Negociador',
    descricao: 'Especialista em resolução de conflitos',
    atributosPrimarios: ['CAR', 'SAB'],
    atributosSecundarios: ['INT', 'CON'],
    pericias: ['Negociação', 'Psicologia', 'Diplomacia', 'Empatia'],
    equipamentoInicial: ['Telefone', 'Gravador', 'Manual de negociação', 'Colete']
  }
}

export function gerarAtributos() {
  const atributos = {}
  Object.keys(ATRIBUTOS).forEach(chave => {
    // 3d6 (sistema D&D clássico)
    let valor = 0
    for (let i = 0; i < 3; i++) {
      valor += Math.floor(Math.random() * 6) + 1
    }
    atributos[chave] = valor
  })
  return atributos
}

export function calcularModificador(atributo) {
  return Math.floor((atributo - 10) / 2)
}

export function rolarDado(lados = 20) {
  return Math.floor(Math.random() * lados) + 1
}

export function fazerTeste(bonus, dificuldade = 10) {
  const dado = rolarDado(20)
  const resultado = dado + bonus
  
  return {
    dado,
    bonus,
    resultado,
    sucesso: resultado >= dificuldade,
    margem: resultado - dificuldade,
    critico: dado === 20,
    falhaCritica: dado === 1
  }
}

export function criarPersonagem(nome, classe, atributos = null) {
  const attrs = atributos || gerarAtributos()
  const classeInfo = CLASSES[classe]
  
  const pericias = {}
  classeInfo.pericias.forEach(pericia => {
    pericias[pericia] = 2 // +2 em perícias da classe
  })
  
  return {
    nome,
    classe,
    nivel: 1,
    experiencia: 0,
    atributos: attrs,
    pericias,
    vidaMaxima: 10 + calcularModificador(attrs.CON),
    vidaAtual: 10 + calcularModificador(attrs.CON),
    sanidadeMaxima: 10 + calcularModificador(attrs.SAB),
    sanidadeAtual: 10 + calcularModificador(attrs.SAB),
    inventario: [...classeInfo.equipamentoInicial],
    moedas: 50,
    status: []
  }
}
