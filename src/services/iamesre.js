// IA Mestre para RPG de Mesa Narrativo

export class IAMestre {
  constructor() {
    this.contexto = {
      cena: null,
      personagem: null,
      historia: [],
      ambiente: 'delegacia'
    }
  }

  // Gera descrição de cena baseada no contexto
  gerarDescricaoCena(tipoCena, personagem, contexto) {
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
      ]
    }
    
    const descricoesTipo = descricoes[tipoCena] || descricoes.investigacao
    return descricoesTipo[Math.floor(Math.random() * descricoesTipo.length)]
  }

  // Gera opções de ação baseadas na cena atual
  gerarOpcoes(cena, personagem) {
    const opcoesBase = {
      investigacao: [
        {
          texto: 'Examinar cuidadosamente a cena',
          pericia: 'Investigação',
          dificuldade: 12
        },
        {
          texto: 'Procurar por pistas ocultas',
          pericia: 'Percepção',
          dificuldade: 14
        },
        {
          texto: 'Coletar evidências',
          pericia: 'Forense',
          dificuldade: 11
        }
      ],
      interrogatorio: [
        {
          texto: 'Interrogar o suspeito',
          pericia: 'Interrogatório',
          dificuldade: 10
        },
        {
          texto: 'Analisar a linguagem corporal',
          pericia: 'Psicologia',
          dificuldade: 13
        },
        {
          texto: 'Pressionar por informações',
          pericia: 'Intimidação',
          dificuldade: 15
        }
      ],
      acao: [
        {
          texto: 'Agir rapidamente',
          pericia: 'Combate',
          dificuldade: 12
        },
        {
          texto: 'Usar o ambiente a seu favor',
          pericia: 'Destreza',
          dificuldade: 14
        },
        {
          texto: 'Proteger civis',
          pericia: 'Constituição',
          dificuldade: 10
        }
      ]
    }
    
    return opcoesBase[cena.tipo] || opcoesBase.investigacao
  }

  // Processa o resultado de uma ação
  processarResultado(acao, sucesso, personagem) {
    const resultados = {
      sucesso: {
        investigacao: [
          'Você encontra uma pista crucial que ninguém mais notou.',
          'Sua análise revela informações importantes sobre o caso.',
          'As evidências coletadas fortalecem sua investigação.'
        ],
        interrogatorio: [
          'O suspeito revela informações valiosas sob pressão.',
          'Você percebe uma contradição na história do suspeito.',
          'Sua técnica de interrogatório funciona perfeitamente.'
        ],
        acao: [
          'Sua ação rápida resolve a situação com sucesso.',
          'Você consegue controlar a cena efetivamente.',
          'Sua intervenção evita consequências piores.'
        ]
      },
      falha: {
        investigacao: [
          'Você não encontra nada de imediato, mas não desista.',
          'A cena é mais complexa do que parecia.',
          'Precisa de mais tempo ou uma abordagem diferente.'
        ],
        interrogatorio: [
          'O suspeito permanece em silêncio ou negativa tudo.',
          'Sua abordagem não funciona como esperado.',
          'O suspeito parece preparado para interrogatório.'
        ],
        acao: [
          'A situação se complica com sua ação.',
          'Você precisa reagir rapidamente às consequências.',
          'O desafio se torna maior do que esperava.'
        ]
      }
    }
    
    const tipo = sucesso ? 'sucesso' : 'falha'
    const resultadosTipo = resultados[tipo][acao.tipo] || resultados[tipo].investigacao
    
    return resultadosTipo[Math.floor(Math.random() * resultadosTipo.length)]
  }

  // Gera a próxima cena baseada na história
  gerarProximaCena(historia, personagem) {
    const cenas = [
      {
        tipo: 'investigacao',
        titulo: 'Novas Descobertas',
        descricao: 'Sua investigação o leva a um novo local com mais perguntas do que respostas.'
      },
      {
        tipo: 'interrogatorio',
        titulo: 'Testemunha Chave',
        descricao: 'Uma nova testemunha aparece com informações importantes.'
      },
      {
        tipo: 'acao',
        titulo: 'Confronto Inesperado',
        descricao: 'A situação se intensifica quando você menos espera.'
      }
    ]
    
    return cenas[Math.floor(Math.random() * cenas.length)]
  }

  // Gera NPCs para interação
  gerarNPC(tipo, contexto) {
    const npcs = {
      suspeito: {
        nomes: ['Carlos Silva', 'Maria Santos', 'João Oliveira', 'Ana Costa'],
        caracteristicas: ['nervoso', 'calmo', 'agressivo', 'cooperativo']
      },
      testemunha: {
        nomes: ['Pedro Martins', 'Luiza Fernandes', 'Marcos Lima', 'Clara Rocha'],
        caracteristicas: ['assustado', 'confiante', 'confuso', 'ajudador']
      },
      perito: {
        nomes: ['Dr. Ricardo Mendes', 'Dra. Paula Castro', 'Dr. Gustavo Alves'],
        caracteristicas: ['metódico', 'detalhista', 'cético', 'eficiente']
      }
    }
    
    const tipoNPC = npcs[tipo] || npcs.suspeito
    const nome = tipoNPC.nomes[Math.floor(Math.random() * tipoNPC.nomes.length)]
    const caracteristica = tipoNPC.caracteristicas[Math.floor(Math.random() * tipoNPC.caracteristicas.length)]
    
    return {
      nome,
      tipo,
      caracteristica,
      descricao: ${nome} parece .
    }
  }
}

// Instância global da IA Mestre
export const iaMestre = new IAMestre()

// Funções auxiliares
export function criarCenaIA(tipo, personagem, contexto = {}) {
  return {
    id: Date.now(),
    tipo,
    titulo: Cena de ,
    descricao: iaMestre.gerarDescricaoCena(tipo, personagem, contexto),
    opcoes: iaMestre.gerarOpcoes({ tipo }, personagem),
    npcs: [iaMestre.gerarNPC('suspeito', contexto)]
  }
}

export function processarAcaoIA(acao, resultado, personagem) {
  return {
    descricao: iaMestre.processarResultado(acao, resultado.sucesso, personagem),
    proximaCena: iaMestre.gerarProximaCena([], personagem),
    consequencias: resultado.sucesso ? ['ganhos'] : ['perdas']
  }
}
// IA Mestre para RPG de Mesa Narrativo

export class IAMestre {
  gerarDescricaoCena(tipoCena, personagem) {
    return ${personagem.nome} chega ao local do crime. A cena é caótica.
  }
}

export const iaMestre = new IAMestre()
