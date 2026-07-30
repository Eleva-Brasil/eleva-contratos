import { fmtBRL0, fmtNum } from '../utils.js'

export default function KpiStrip({ summary }) {
  return (
    <div className="kpis">
      <div className="kpi">
        <div className="k-label">Faturamento Total</div>
        <div className="k-value">{fmtBRL0(summary.grand_total)}</div>
        <div className="k-sub">Equipamentos + Operadores</div>
      </div>
      <div className="kpi accent-steel">
        <div className="k-label">Equipamentos Ativos</div>
        <div className="k-value">{fmtNum(summary.grand_qtde)}</div>
        <div className="k-sub">com Nº de série válido</div>
      </div>
      <div className="kpi accent-green">
        <div className="k-label">Vendedores</div>
        <div className="k-value">{summary.n_vendedores}</div>
        <div className="k-sub">com contratos no período</div>
      </div>
      <div className="kpi">
        <div className="k-label">Ticket Médio Geral</div>
        <div className="k-value">{fmtBRL0(summary.ticket_medio_geral)}</div>
        <div className="k-sub">por equipamento</div>
      </div>
    </div>
  )
}
