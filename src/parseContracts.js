import * as XLSX from 'xlsx'

// ---------------------------------------------------------------
// Mesma lógica usada para gerar os JSONs em src/data/*.json,
// portada para rodar no navegador quando o usuário sobe uma
// planilha atualizada (.xlsx) pelo painel "Atualizar dados".
// ---------------------------------------------------------------

const REGIAO = {
  AC: 'Norte', AP: 'Norte', AM: 'Norte', PA: 'Norte', RO: 'Norte', RR: 'Norte', TO: 'Norte',
  AL: 'Nordeste', BA: 'Nordeste', CE: 'Nordeste', MA: 'Nordeste', PB: 'Nordeste', PE: 'Nordeste',
  PI: 'Nordeste', RN: 'Nordeste', SE: 'Nordeste',
  DF: 'Centro-Oeste', GO: 'Centro-Oeste', MT: 'Centro-Oeste', MS: 'Centro-Oeste',
  ES: 'Sudeste', MG: 'Sudeste', RJ: 'Sudeste', SP: 'Sudeste',
  PR: 'Sul', RS: 'Sul', SC: 'Sul',
}

// Correções conhecidas de grafia/acentuação (mesma tabela usada no processamento original)
const CANON = {
  'São Paulo|SP': 'São Paulo', 'Sao Paulo|SP': 'São Paulo',
  'São Pailo|SP': 'São Paulo', 'São Pualo|SP': 'São Paulo',
  'Inocência|MS': 'Inocência', 'Inocencia|MS': 'Inocência', 'Inocenicia|MS': 'Inocência',
  'Eusebio|CE': 'Eusébio', 'Luis Gomes|RN': 'Luís Gomes',
  'Mairipora|SP': 'Mairiporã', 'Maringa|PR': 'Maringá', 'Maua|SP': 'Mauá',
  'Piracibaca|SP': 'Piracicaba', 'Sao Caetano do Sul|SP': 'São Caetano do Sul',
  'Sao Carlos|SC': 'São Carlos', 'Sao Joao da Boa Vista|SP': 'São João da Boa Vista',
}

function titleCaseCity(raw) {
  const small = new Set(['de', 'da', 'do', 'das', 'dos', 'e'])
  return raw
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((w, i) => (i > 0 && small.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(' ')
}

function parseEndereco(endereco) {
  // Ex.: "... - LUCAS DO RIO VERDE/MT - CEP: 78455000"
  const m = /-\s*([^-/]+)\/([A-Za-z]{2})\s*-\s*CEP/i.exec(endereco || '')
  if (!m) return { cidade: 'Não identificado', estado: 'NI' }
  const cidadeRaw = titleCaseCity(m[1])
  const estado = m[2].trim().toUpperCase()
  const key = `${cidadeRaw}|${estado}`
  const cidade = CANON[key] || cidadeRaw
  return { cidade, estado }
}

// Aliases aceitos para cada coluna (comparados após normalizar: trim + minúsculas + sem acento).
// Colunas desconhecidas na planilha (ex.: "Status LOC1") são simplesmente ignoradas —
// não é preciso que a ordem ou o conjunto de colunas seja idêntico ao original.
const HEADER_ALIASES = {
  cliente: ['nome do parceiro de negocios', 'nome do parceiro', 'cliente'],
  contrato: ['cod. contrato', 'cod contrato', 'contrato'],
  serie: ['n.serie', 'n serie', 'no serie', 'numero de serie', 'serie'],
  modelo: ['modelo'],
  tipoModelo: ['tipo modelo'],
  apelido: ['apelido'],
  valorLoc: ['valor da locacao'],
  valorServ: ['valor de servico'],
  endereco: ['endereco de entrega', 'endereco'],
  vendedor: ['vendedor'],
}

function normalizeHeader(h) {
  return String(h ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}

function buildColumnIndex(headerRow) {
  const normalized = headerRow.map(normalizeHeader)
  const idx = {}
  const faltando = []
  for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
    const pos = normalized.findIndex((h) => aliases.includes(h))
    idx[field] = pos // -1 se não encontrada
  }
  // Campos indispensáveis para o cálculo do frete
  for (const field of ['cliente', 'contrato', 'serie', 'valorLoc', 'valorServ', 'endereco', 'vendedor']) {
    if (idx[field] === -1) faltando.push(field)
  }
  if (faltando.length) {
    throw new Error(
      `Não encontrei a(s) coluna(s) obrigatória(s) na planilha: ${faltando.join(', ')}. ` +
      `Confira se os nomes dos cabeçalhos não foram alterados.`
    )
  }
  return idx
}

/**
 * Recebe um File (input do usuário) apontando para a planilha de contratos
 * e devolve { summary, analitica, dadosTratados } no mesmo formato usado
 * pelos componentes do dashboard.
 *
 * As colunas são casadas pelo nome do cabeçalho (não pela posição), então
 * colunas extras ou fora de ordem não quebram a leitura — só as colunas
 * obrigatórias (ver HEADER_ALIASES) precisam existir, em qualquer posição.
 */
export async function parseContractsFile(file) {
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array' })
  const sheetName = wb.SheetNames[0]
  const ws = wb.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, raw: true, defval: '' })

  const [headerRow, ...dataRows] = rows
  const col = buildColumnIndex(headerRow)

  const records = []
  let excluidasBranco = 0
  let excluidasSemSerie = 0

  for (const r of dataRows) {
    const cliente = r[col.cliente]
    const contrato = r[col.contrato]
    const serie = r[col.serie]
    const modelo = col.modelo !== -1 ? r[col.modelo] : ''
    const tipoModelo = col.tipoModelo !== -1 ? r[col.tipoModelo] : ''
    const apelido = col.apelido !== -1 ? r[col.apelido] : ''
    const valorLoc = r[col.valorLoc]
    const valorServ = r[col.valorServ]
    const endereco = r[col.endereco]
    const vendedor = r[col.vendedor]

    const isBlank = [cliente, contrato, vendedor].every((v) => v === '' || v === undefined || v === null)
    if (isBlank) { excluidasBranco++; continue }

    if (serie === '' || serie === undefined || serie === null) { excluidasSemSerie++; continue }

    const { cidade, estado } = parseEndereco(String(endereco))
    const regiao = REGIAO[estado] || 'Não identificado'

    records.push({
      contrato: String(contrato).trim(),
      cliente: String(cliente).trim(),
      vendedor: String(vendedor).trim(),
      serie: String(serie).trim(),
      perfil: modelo ? String(modelo).trim() : 'Não informado',
      modelo_categ: tipoModelo ? String(tipoModelo).trim() : 'Não classificado',
      apelido: apelido ? String(apelido).trim() : 'Não informado',
      equipamentos: Number(valorLoc) || 0,
      operadores: Number(valorServ) || 0,
      cidade, estado, regiao,
      endereco: String(endereco || '').trim(),
    })
  }

  const val = (r) => r.equipamentos + r.operadores
  const grandTotal = records.reduce((a, r) => a + val(r), 0)

  // ---- Sintética (por vendedor) ----
  const vendMap = new Map()
  for (const r of records) {
    if (!vendMap.has(r.vendedor)) vendMap.set(r.vendedor, { qtde: 0, equip: 0, oper: 0, total: 0 })
    const v = vendMap.get(r.vendedor)
    v.qtde += 1; v.equip += r.equipamentos; v.oper += r.operadores; v.total += val(r)
  }
  const vendedores = [...vendMap.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .map(([nome, v]) => ({
      nome, qtde: v.qtde, equip: round2(v.equip), oper: round2(v.oper), total: round2(v.total),
      pct: round1((v.total / grandTotal) * 100), ticket: round2(v.total / v.qtde),
    }))

  // ---- Vendedor x Categoria ----
  const categorias = [...new Set(records.map((r) => r.modelo_categ))].sort()
  const vendedorCategoria = vendedores.map(({ nome }) => {
    const valores = categorias.map((c) =>
      round2(records.filter((r) => r.vendedor === nome && r.modelo_categ === c).reduce((a, r) => a + val(r), 0))
    )
    const qtds = categorias.map((c) => records.filter((r) => r.vendedor === nome && r.modelo_categ === c).length)
    return { nome, valores, qtds }
  })

  // ---- Geografia ----
  function aggBy(keyFn) {
    const map = new Map()
    for (const r of records) {
      const k = keyFn(r)
      if (!map.has(k)) map.set(k, { qtde: 0, total: 0 })
      const e = map.get(k)
      e.qtde += 1; e.total += val(r)
    }
    return map
  }
  const regMap = aggBy((r) => r.regiao)
  const regioes = [...regMap.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .map(([nome, v]) => ({ nome, qtde: v.qtde, total: round2(v.total), pct: round1((v.total / grandTotal) * 100) }))

  const estMap = new Map()
  for (const r of records) {
    if (!estMap.has(r.estado)) estMap.set(r.estado, { qtde: 0, total: 0, regiao: r.regiao })
    const e = estMap.get(r.estado)
    e.qtde += 1; e.total += val(r)
  }
  const estados = [...estMap.entries()]
    .sort((a, b) => b[1].total - a[1].total)
    .map(([uf, v]) => ({ uf, regiao: v.regiao, qtde: v.qtde, total: round2(v.total), pct: round1((v.total / grandTotal) * 100) }))

  const cidMap = new Map()
  for (const r of records) {
    const k = `${r.cidade}|${r.estado}`
    if (!cidMap.has(k)) cidMap.set(k, { qtde: 0, total: 0, cidade: r.cidade, uf: r.estado })
    const e = cidMap.get(k)
    e.qtde += 1; e.total += val(r)
  }
  const cidades = [...cidMap.values()]
    .sort((a, b) => b.total - a.total)
    .map((v) => ({ cidade: v.cidade, uf: v.uf, qtde: v.qtde, total: round2(v.total), pct: round1((v.total / grandTotal) * 100) }))

  const summary = {
    grand_total: round2(grandTotal),
    grand_qtde: records.length,
    n_vendedores: vendMap.size,
    ticket_medio_geral: round2(grandTotal / records.length),
    vendedores, categorias, vendedor_categoria: vendedorCategoria,
    regioes, estados, cidades,
    _meta: { excluidasBranco, excluidasSemSerie, arquivo: file.name, atualizadoEm: new Date().toISOString() },
  }

  const analitica = [...records]
    .sort((a, b) => (a.vendedor < b.vendedor ? -1 : a.vendedor > b.vendedor ? 1 : val(b) - val(a)))
    .map((r) => ({
      vendedor: r.vendedor, contrato: r.contrato, cliente: r.cliente, perfil: r.perfil,
      modelo: r.modelo_categ, apelido: r.apelido, serie: r.serie, cidade: r.cidade, estado: r.estado,
      equip: round2(r.equipamentos), oper: round2(r.operadores), total: round2(val(r)),
    }))

  const dadosTratados = records.map((r) => ({
    contrato: r.contrato, cliente: r.cliente, vendedor: r.vendedor, serie: r.serie,
    perfil: r.perfil, modelo: r.modelo_categ, apelido: r.apelido,
    equip: round2(r.equipamentos), oper: round2(r.operadores), total: round2(val(r)),
    cidade: r.cidade, estado: r.estado, regiao: r.regiao, endereco: r.endereco,
  }))

  return { summary, analitica, dadosTratados }
}

function round2(v) { return Math.round(v * 100) / 100 }
function round1(v) { return Math.round(v * 10) / 10 }
