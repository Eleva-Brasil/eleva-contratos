import { fmtBRL0 } from '../utils.js'

function heatColor(v, max) {
  if (v <= 0) return null
  const t = Math.sqrt(v / max)
  const r1 = 42, g1 = 32, b1 = 16
  const r2 = 245, g2 = 166, b2 = 35
  const r = Math.round(r1 + (r2 - r1) * t)
  const g = Math.round(g1 + (g2 - g1) * t)
  const b = Math.round(b1 + (b2 - b1) * t)
  return `rgb(${r},${g},${b})`
}

export default function TabCategoria({ categorias, vendedorCategoria }) {
  const allVals = vendedorCategoria.flatMap((r) => r.valores).filter((v) => v > 0)
  const maxHeat = Math.max(...allVals)

  return (
    <div className="panel">
      <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
      <div className="panel-label">Mix de Vendas</div>
      <div className="panel-title">Vendedor × Categoria de Equipamento <span className="tag">R$ mil</span></div>

      <div className="heatmap-wrap">
        <table className="heatmap">
          <thead>
            <tr>
              <th>Vendedor</th>
              {categorias.map((c) => (
                <th className="cat-head" key={c}>{c}</th>
              ))}
              <th className="num">Total</th>
            </tr>
          </thead>
          <tbody>
            {vendedorCategoria.map((row) => {
              const rowTotal = row.valores.reduce((a, b) => a + b, 0)
              return (
                <tr key={row.nome}>
                  <td className="heat-name">{row.nome}</td>
                  {row.valores.map((v, i) => (
                    <td
                      key={i}
                      className={`heat-cell ${v <= 0 ? 'zero' : ''}`}
                      style={v > 0 ? { background: heatColor(v, maxHeat) } : undefined}
                      title={`${row.qtds[i]} equip.`}
                    >
                      {v > 0 ? Math.round(v / 1000) : '—'}
                    </td>
                  ))}
                  <td className="num" style={{ fontFamily: 'var(--mono)' }}>{fmtBRL0(rowTotal)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="footnote">Valores em milhares de reais (R$ mil). Intensidade da cor proporcional ao valor da célula.</div>
    </div>
  )
}
