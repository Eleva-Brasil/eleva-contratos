export const fmtBRL = (v) =>
  'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const fmtBRL0 = (v) =>
  'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

export const fmtNum = (v) => Number(v).toLocaleString('pt-BR')

export const COLORS = ['#f5a623', '#5b9bd5', '#3ecf8e', '#e5484d', '#a78bfa', '#f0729c', '#4dd0e1', '#c9a227', '#7ea8c4']

// Builds a CSS conic-gradient string from an array of {label, value} slices
export function buildConicGradient(items, colors = COLORS) {
  const total = items.reduce((a, b) => a + b.value, 0)
  let acc = 0
  const stops = items.map((item, i) => {
    const start = (acc / total) * 360
    acc += item.value
    const end = (acc / total) * 360
    return `${colors[i % colors.length]} ${start}deg ${end}deg`
  })
  return `conic-gradient(${stops.join(', ')})`
}
