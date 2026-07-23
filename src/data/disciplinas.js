export const anos = {
  1: {
    label: '1º Ano',
    desc: 'Fundamentos da programação, lógica, introdução à computação e primeiros passos no desenvolvimento web.',
    disciplinas: [
      { id: 'logica', name: 'Lógica de Programação', icon: 'mdi-language-javascript' },
      { id: 'web1', name: 'Desenvolvimento Web I', icon: 'mdi-vuejs' },
      { id: 'intro', name: 'Introdução à Computação', icon: 'mdi-laptop' },
      { id: 'projeto1', name: 'Projeto Integrador I', icon: 'mdi-folder-star-outline' },
    ],
  },
  2: {
    label: '2º Ano',
    desc: 'Banco de dados, engenharia de software, desenvolvimento web avançado e projetos integrados.',
    disciplinas: [
      { id: 'banco', name: 'Banco de Dados', icon: 'mdi-database' },
      { id: 'software', name: 'Projeto de Software', icon: 'mdi-cog-outline' },
      { id: 'web2', name: 'Desenvolvimento Web II', icon: 'mdi-vuejs' },
      { id: 'projeto2', name: 'Projeto Integrador II', icon: 'mdi-folder-star-outline' },
    ],
  },
  3: {
    label: '3º Ano',
    desc: 'Desenvolvimento web avançado, mobile, redes de computadores e projeto final integrador.',
    disciplinas: [
      { id: 'web3', name: 'Desenvolvimento Web III', icon: 'mdi-language-python' },
      { id: 'mobile', name: 'Desenvolvimento Web Mobile', icon: 'mdi-cellphone' },
      { id: 'projeto3', name: 'Projeto Integrador', icon: 'mdi-folder-star-outline' },
      { id: 'redes', name: 'Redes de Computadores', icon: 'mdi-network' },
    ],
  },
}

export const disciplinaNomes = {
  logica: 'Lógica de Programação',
  web1: 'Desenvolvimento Web I',
  intro: 'Introdução à Computação',
  projeto1: 'Projeto Integrador I',
  banco: 'Banco de Dados',
  software: 'Projeto de Software',
  web2: 'Desenvolvimento Web II',
  projeto2: 'Projeto Integrador II',
  web3: 'Desenvolvimento Web III',
  mobile: 'Desenvolvimento Web Mobile',
  projeto3: 'Projeto Integrador',
  redes: 'Redes de Computadores',
}

export const disciplinaDescricoes = {
  logica: 'Desenvolvimento do raciocínio lógico, algoritmos e fundamentos da programação.',
  web1: 'Estruturação de páginas web com HTML, CSS e introdução ao JavaScript.',
  intro: 'Conceitos fundamentais de computação, hardware, software e sistemas operacionais.',
  projeto1: 'Primeiro projeto integrador aplicando os conhecimentos do primeiro ano.',
  banco: 'Modelagem de dados, consultas SQL, normalização e gestão de bancos de dados relacionais.',
  software: 'Metodologias de desenvolvimento de software, UML, requisitos e gestão de projetos.',
  web2: 'Desenvolvimento back-end e front-end com foco em aplicações web completas.',
  projeto2: 'Projeto integrador combinando banco de dados, web e engenharia de software.',
  web3: 'Frameworks modernos, APIs, autenticação e arquiteturas avançadas de web apps.',
  mobile: 'Desenvolvimento de aplicações web responsivas e híbridas para dispositivos móveis.',
  projeto3: 'Projeto final integrador aplicando todas as competências do curso.',
  redes: 'Fundamentos de redes, protocolos TCP/IP, configuração de roteadores e segurança de rede.',
}

const STORAGE_KEY = 'sio-atividades'

function loadAtividades() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function persistAtividades() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(atividades))
}

export const atividades = loadAtividades()

export function addAtividade(disciplinaId, atividade) {
  if (!atividades[disciplinaId]) {
    atividades[disciplinaId] = []
  }
  const id = Date.now()
  const newAtividade = { id, ...atividade }
  atividades[disciplinaId].push(newAtividade)
  persistAtividades()
  return newAtividade
}

export function deleteAtividade(disciplinaId, atividadeId) {
  const lista = atividades[disciplinaId]
  if (!lista) return false
  const idx = lista.findIndex((a) => a.id === Number(atividadeId))
  if (idx === -1) return false
  lista.splice(idx, 1)
  persistAtividades()
  return true
}

export function editAtividade(disciplinaId, atividadeId, updates) {
  const lista = atividades[disciplinaId]
  if (!lista) return null
  const idx = lista.findIndex((a) => a.id === Number(atividadeId))
  if (idx === -1) return null
  Object.assign(lista[idx], updates)
  persistAtividades()
  return lista[idx]
}

export function getAnoIdByDisciplina(disciplinaId) {
  for (const [anoId, ano] of Object.entries(anos)) {
    if (ano.disciplinas.some((d) => d.id === disciplinaId)) {
      return anoId
    }
  }
  return null
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

export function searchAtividades(query) {
  if (!query || query.trim().length < 2) return []
  const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const results = []

  for (const [anoId, ano] of Object.entries(anos)) {
    for (const disc of ano.disciplinas) {
      const lista = getAtividades(disc.id)
      for (const ativ of lista) {
        const titleMatch = ativ.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .includes(q)
        const descMatch = ativ.desc
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .includes(q)
        const questMatch = ativ.questoes.some((qst) =>
          qst.enunciado
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .includes(q),
        )
        if (titleMatch || descMatch || questMatch) {
          results.push({
            anoId: Number(anoId),
            anoLabel: ano.label,
            disciplina: disc,
            atividade: ativ,
          })
        }
      }
    }
  }
  return results
}
