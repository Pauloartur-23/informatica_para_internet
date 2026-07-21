export const anos = {
  1: {
    label: '1\u00ba Ano',
    desc: 'Fundamentos da programa\u00e7\u00e3o, l\u00f3gica e introdu\u00e7\u00e3o ao desenvolvimento web.',
    disciplinas: [
      { id: 'logica', name: 'L\u00f3gica de Programa\u00e7\u00e3o', icon: 'mdi-binary' },
      {
        id: 'web',
        name: 'Introdu\u00e7\u00e3o ao Desenvolvimento Web',
        icon: 'mdi-language-html5',
      },
      { id: 'banco', name: 'Banco de Dados I', icon: 'mdi-database' },
    ],
  },
  2: {
    label: '2\u00ba Ano',
    desc: 'Desenvolvimento front-end e back-end com foco em aplica\u00e7\u00f5es web completas.',
    disciplinas: [
      { id: 'frontend', name: 'Desenvolvimento Front-End', icon: 'mdi-palette-swatch' },
      { id: 'backend', name: 'Desenvolvimento Back-End', icon: 'mdi-server' },
      { id: 'banco2', name: 'Banco de Dados II', icon: 'mdi-database-settings' },
    ],
  },
  3: {
    label: '3\u00ba Ano',
    desc: 'Projetos integrados, est\u00e1gio supervisionado e constru\u00e7\u00e3o de portf\u00f3lio profissional.',
    disciplinas: [
      { id: 'projeto', name: 'Projetos Integrados', icon: 'mdi-folder-star-outline' },
      { id: 'estagio', name: 'Est\u00e1gio Supervisionado', icon: 'mdi-briefcase-outline' },
      {
        id: 'portfolio',
        name: 'Portf\u00f3lio Profissional',
        icon: 'mdi-card-account-details-outline',
      },
    ],
  },
}

export const disciplinaNomes = {
  logica: 'L\u00f3gica de Programa\u00e7\u00e3o',
  web: 'Introdu\u00e7\u00e3o ao Desenvolvimento Web',
  banco: 'Banco de Dados I',
  frontend: 'Desenvolvimento Front-End',
  backend: 'Desenvolvimento Back-End',
  banco2: 'Banco de Dados II',
  projeto: 'Projetos Integrados',
  estagio: 'Est\u00e1gio Supervisionado',
  portfolio: 'Portf\u00f3lio Profissional',
}

export const disciplinaDescricoes = {
  logica:
    'Desenvolvimento do racioc\u00ednio l\u00f3gico e algoritmos fundamentais para programa\u00e7\u00e3o.',
  web: 'Estrutura\u00e7\u00e3o de p\u00e1ginas web com HTML, CSS e introdu\u00e7\u00e3o ao JavaScript.',
  banco: 'Conceitos de banco de dados relacionais, modelagem e consultas SQL.',
  frontend: 'Interfaces modernas com Vue.js, componentes reutiliz\u00e1veis e responsividade.',
  backend: 'APIs REST com Node.js/Express, autentica\u00e7\u00e3o e l\u00f3gica de servidor.',
  banco2:
    'Consultas avan\u00e7adas, normaliza\u00e7\u00e3o, procedimentos armazenados e otimiza\u00e7\u00e3o.',
  projeto: 'Desenvolvimento colaborativo de projetos completos integrando todas as disciplinas.',
  estagio: 'Experi\u00eancia profissional supervisionada em empresas do setor de tecnologia.',
  portfolio:
    'Constru\u00e7\u00e3o de portf\u00f3lio profissional com projetos reais e apresenta\u00e7\u00e3o de compet\u00eancias.',
}

export const atividades = {
  logica: [
    {
      id: 1,
      title: 'Vari\u00e1veis e Tipos de Dados',
      desc: 'Praticando a declara\u00e7\u00e3o de vari\u00e1veis, tipos primitivos e operadores b\u00e1sicos.',
      questoes: [
        {
          enunciado: 'Crie um algoritmo que leia dois n\u00fameros inteiros e exiba a soma deles.',
          tipo: 'exercicio',
        },
        {
          enunciado: 'Explique a diferen\u00e7a entre as vari\u00e1veis do tipo Integer e Float.',
          tipo: 'teorica',
        },
        {
          enunciado:
            'Declare uma vari\u00e1vel para armazenar o nome de um aluno e outra para a m\u00e9dia. Exiba uma mensagem formatada com os dados.',
          tipo: 'exercicio',
        },
      ],
    },
    {
      id: 2,
      title: 'Estruturas Condicionais',
      desc: 'Uso de if/else, switch e opera\u00e7\u00f5es l\u00f3gicas para controle de fluxo.',
      questoes: [
        {
          enunciado:
            'Crie um programa que receba uma nota e exiba se o aluno foi aprovado (>= 7) ou reprovado.',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'Desenvolva um sistema simples que classifique uma idade em: crian\u00e7a, adolescente, adulto ou idoso.',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'Qual \u00e9 a diferen\u00e7a entre o operador l\u00f3gico AND e OR? D\u00ea um exemplo pr\u00e1tico de cada.',
          tipo: 'teorica',
        },
      ],
    },
    {
      id: 3,
      title: 'La\u00e7os de Repeti\u00e7\u00e3o',
      desc: 'Estruturas de repeti\u00e7\u00e3o: for, while e do-while.',
      questoes: [
        { enunciado: 'Crie um algoritmo que exiba os n\u00fameros de 1 a 50.', tipo: 'exercicio' },
        {
          enunciado: 'Desenvolva um programa que leia 5 n\u00fameros e calcule a m\u00e9dia.',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'Explique quando \u00e9 adequado utilizar um la\u00e7o while em vez de um for.',
          tipo: 'teorica',
        },
      ],
    },
  ],
  web: [
    {
      id: 1,
      title: 'Estrutura B\u00e1sica HTML',
      desc: 'Tags sem\u00e2nticas, estrutura de documento e elementos de texto.',
      questoes: [
        {
          enunciado:
            'Crie uma p\u00e1gina HTML com t\u00edtulo, par\u00e1grafo, imagem e um link externo.',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'Qual a diferen\u00e7a entre as tags <article>, <section> e <div>? Quando usar cada uma?',
          tipo: 'teorica',
        },
        {
          enunciado:
            'Crie uma tabela HTML com 3 colunas (Nome, Nota, Conceito) e 5 linhas de dados.',
          tipo: 'exercicio',
        },
      ],
    },
    {
      id: 2,
      title: 'Estiliza\u00e7\u00e3o com CSS',
      desc: 'Propriedades de layout, box model, flexbox e seletores.',
      questoes: [
        {
          enunciado:
            'Estilize a p\u00e1gina do exerc\u00edcio anterior aplicando cores, fontes e espa\u00e7amento.',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'Explique o conceito de Box Model no CSS e como as propriedades margin, border, padding e content interagem.',
          tipo: 'teorica',
        },
        {
          enunciado:
            'Crie um layout de card utilizando Flexbox com imagem, t\u00edtulo e bot\u00e3o.',
          tipo: 'exercicio',
        },
      ],
    },
    {
      id: 3,
      title: 'Introdu\u00e7\u00e3o ao JavaScript',
      desc: 'Vari\u00e1veis, fun\u00e7\u00f5es, eventos e manipula\u00e7\u00e3o do DOM.',
      questoes: [
        {
          enunciado:
            'Crie um bot\u00e3o que, ao ser clicado, exibe um alerta com o nome do usu\u00e1rio.',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'Escreva uma fun\u00e7\u00e3o que receba dois n\u00fameros e retorne o maior deles.',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'O que \u00e9 o DOM e como o JavaScript interage com ele? Cite 3 m\u00e9todos comuns de manipula\u00e7\u00e3o.',
          tipo: 'teorica',
        },
      ],
    },
  ],
  banco: [
    {
      id: 1,
      title: 'Modelagem de Dados',
      desc: 'Entidades, atributos, chaves prim\u00e1rias e estrangeiras.',
      questoes: [
        {
          enunciado:
            'Modele um banco de dados para uma biblioteca escolar com tabelas de Livros, Alunos e Empr\u00e9stimos.',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'Explique o que s\u00e3o chaves prim\u00e1rias e estrangeiras. Qual sua import\u00e2ncia na integridade dos dados?',
          tipo: 'teorica',
        },
        {
          enunciado:
            'Crie um diagrama ER (Entidade-Relacionamento) para um sistema de cadastro de alunos e disciplinas.',
          tipo: 'exercicio',
        },
      ],
    },
    {
      id: 2,
      title: 'Consultas SQL B\u00e1sicas',
      desc: 'SELECT, WHERE, ORDER BY, JOIN e fun\u00e7\u00f5es de agrega\u00e7\u00e3o.',
      questoes: [
        {
          enunciado: 'Escreva uma consulta SQL que retorne todos os alunos ordenados por nome.',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'Crie uma consulta que use JOIN para listar os empr\u00e9stimos de um aluno com o nome do livro.',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'Quais s\u00e3o as principais fun\u00e7\u00f5es de agrega\u00e7\u00e3o do SQL? D\u00ea um exemplo de uso de cada uma.',
          tipo: 'teorica',
        },
      ],
    },
  ],
  frontend: [
    {
      id: 1,
      title: 'Componentes Vue.js',
      desc: 'Cria\u00e7\u00e3o de componentes, props, emits e ciclo de vida.',
      questoes: [
        {
          enunciado:
            'Crie um componente de bot\u00e3o que aceite props para cor, texto e tamanho, e emita um evento ao ser clicado.',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'Explique a diferen\u00e7a entre props e data em um componente Vue. Quando usar cada um?',
          tipo: 'teorica',
        },
        {
          enunciado:
            'Desenvolva um componente de lista que receba um array de itens via props e os renderize dinamicamente.',
          tipo: 'exercicio',
        },
      ],
    },
    {
      id: 2,
      title: 'Gerenciamento de Estado',
      desc: 'Pinia, composables e compartilhamento de dados entre componentes.',
      questoes: [
        {
          enunciado:
            'Crie uma store Pinia para gerenciar um carrinho de compras com a\u00e7\u00f5es de adicionar, remover e listar itens.',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'Quais s\u00e3o as vantagens de usar Pinia em vez de passar props por v\u00e1rios n\u00edveis de componentes?',
          tipo: 'teorica',
        },
        {
          enunciado:
            'Crie um composable useLocalStorage que sincronize automaticamente um ref com o localStorage do navegador.',
          tipo: 'exercicio',
        },
      ],
    },
  ],
  backend: [
    {
      id: 1,
      title: 'APIs REST com Express',
      desc: 'Rotas, m\u00e9todos HTTP, middlewares e estrutura\u00e7\u00e3o de projeto.',
      questoes: [
        {
          enunciado:
            'Crie uma API REST com Express que tenha endpoints para CRUD de uma entidade "Aluno".',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'Explique a diferen\u00e7a entre os m\u00e9todos HTTP GET, POST, PUT e PATCH. Quando usar cada um?',
          tipo: 'teorica',
        },
        {
          enunciado:
            'Implemente um middleware de autentica\u00e7\u00e3o que verifique um token JWT antes de permitir o acesso a rotas protegidas.',
          tipo: 'exercicio',
        },
      ],
    },
  ],
  banco2: [
    {
      id: 1,
      title: 'Normaliza\u00e7\u00e3o de Dados',
      desc: 'Formas normais (1FN, 2FN, 3FN) e elimina\u00e7\u00e3o de redund\u00e2ncias.',
      questoes: [
        {
          enunciado:
            'Normalize a tabela "Pedidos" at\u00e9 a 3\u00aa Forma Normal, justificando cada etapa.',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'Quais s\u00e3o os problemas causados por um banco de dados n\u00e3o normalizado? Cite exemplos pr\u00e1ticos.',
          tipo: 'teorica',
        },
        {
          enunciado:
            'Aplique as formas normais em um modelo de dados de um e-commerce com tabelas de Clientes, Pedidos e Produtos.',
          tipo: 'exercicio',
        },
      ],
    },
  ],
  projeto: [
    {
      id: 1,
      title: 'Planejamento do Projeto',
      desc: 'Defini\u00e7\u00e3o de escopo, cronograma, ferramentas e divis\u00e3o de tarefas.',
      questoes: [
        {
          enunciado:
            'Elabore um plano de projeto para um sistema web completo, incluindo escopo, tecnologias e cronograma.',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'Qual a import\u00e2ncia do planejamento antes do in\u00edcio do desenvolvimento? Quais ferramentas podem ser utilizadas?',
          tipo: 'teorica',
        },
        {
          enunciado:
            'Crie um Kanban com as tarefas do projeto, definindo respons\u00e1veis e prazos para cada atividade.',
          tipo: 'exercicio',
        },
      ],
    },
  ],
  estagio: [
    {
      id: 1,
      title: 'Relat\u00f3rio de Est\u00e1gio',
      desc: 'Registro de atividades, aprendizados e desenvolvimento profissional.',
      questoes: [
        {
          enunciado:
            'Escreva um relat\u00f3rio parcial de est\u00e1gio descrevendo as atividades realizadas at\u00e9 o momento.',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'Quais compet\u00eancias t\u00e9cnicas e comportamentais voc\u00ea desenvolveu durante o est\u00e1gio?',
          tipo: 'teorica',
        },
        {
          enunciado:
            'Crie uma apresenta\u00e7\u00e3o resumo do projeto desenvolvido durante o est\u00e1gio, destacando resultados e aprendizados.',
          tipo: 'exercicio',
        },
      ],
    },
  ],
  portfolio: [
    {
      id: 1,
      title: 'Constru\u00e7\u00e3o do Portf\u00f3lio',
      desc: 'Organiza\u00e7\u00e3o de projetos, apresenta\u00e7\u00e3o profissional e autobiografia.',
      questoes: [
        {
          enunciado:
            'Crie uma p\u00e1gina de portf\u00f3lio pessoal com seus principais projetos, incluindo descri\u00e7\u00e3o e links.',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'Escreva uma carta de apresenta\u00e7\u00e3o profissional destacando suas habilidades t\u00e9cnicas e objetivos de carreira.',
          tipo: 'exercicio',
        },
        {
          enunciado:
            'Quais elementos s\u00e3o essenciais em um portf\u00f3lio profissional de um desenvolvedor web?',
          tipo: 'teorica',
        },
      ],
    },
  ],
}

export function getAno(anoId) {
  return anos[anoId] || null
}

export function getDisciplina(anoId, disciplinaId) {
  const ano = getAno(anoId)
  if (!ano) return null
  return ano.disciplinas.find((d) => d.id === disciplinaId) || null
}

export function getAtividades(disciplinaId) {
  return atividades[disciplinaId] || []
}

export function getAtividade(disciplinaId, atividadeId) {
  const lista = getAtividades(disciplinaId)
  return lista.find((a) => a.id === Number(atividadeId)) || null
}
