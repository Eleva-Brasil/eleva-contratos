import Donut from './Donut.jsx'
import SortableTable from './SortableTable.jsx'
import { fmtBRL, fmtBRL0, fmtNum } from '../utils.js'

export default function TabSintetica({ summary }) {
  const { vendedores, grand_total, grand_qtde } = summary
  const maxTotal = Math.max(...vendedores.map((v) => v.total))

  const columns = [
    { key: 'nome', label: 'Vendedor' },
    { key: 'qtde', label: 'Qtde', align: 'right', format: fmtNum },
    { key: 'equip', label: 'Equipamentos (R$)', align: 'right', format: fmtBRL },
    { key: 'oper', label: 'Operadores (R$)', align: 'right', format: fmtBRL },
    { key: 'total', label: 'Total (R$)', align: 'right', format: fmtBRL },
    { key: 'pct', label: '% Fat.', align: 'right', format: (v) => v + '%' },
    { key: 'ticket', label: 'Ticket Médio (R$)', align: 'right', format: fmtBRL },
  ]

  return (
    <>
      <div className="grid-2">
        <div className="panel">
          <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
          <div className="panel-label">Força de Venda</div>
          <div className="panel-title">Ranking de Vendedores <span className="tag">R$</span></div>
          {vendedores.map((v, i) => (
            <div className="vbar-row" key={v.nome}>
              <div className="vbar-top">
                <span className="vbar-name">
                  <span className="rank">{String(i + 1).padStart(2, '0')}</span>
                  {v.nome}
                </span>
                <span className="vbar-val">{fmtBRL0(v.total)} · {v.pct}%</span>
              </div>
              <div className="vbar-track">
                <div className="vbar-fill" style={{ width: `${(v.total / maxTotal) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="panel">
          <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
          <div className="panel-label">Participação</div>
          <div className="panel-title">% do Faturamento Total</div>
          <Donut
            items={vendedores.map((v) => ({ label: v.nome, value: v.total }))}
            centerValue={fmtBRL0(grand_total)}
            centerLabel={`${grand_qtde} equip.`}
          />
        </div>
      </div>

      <div className="panel">
        <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
        <div className="panel-label">Detalhe</div>
        <div className="panel-title">Potencial de Faturamento por Vendedor</div>
        <SortableTable columns={columns} rows={vendedores} defaultSortKey="total" />
      </div>
    </>
  )
}
