import { fmtBRL0 } from '../utils.js'

export default function TabCategoria({ categorias, vendedorCategoria }) {
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
                    >
                      {v > 0 ? (
                        <>
                          <div className="heat-primary">{row.qtds[i]} un</div>
                          <div className="heat-secondary">{Math.round(v / 1000)}</div>
                        </>
                      ) : '—'}
                    </td>
                  ))}
                  <td className="num" style={{ fontFamily: 'var(--mono)' }}>{fmtBRL0(rowTotal)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="footnote">Valores em milhares de reais (R$ mil).</div>
    </div>
  )
}
