import { useMemo, useState } from 'react'
import Donut from './Donut.jsx'
import BarChart from './BarChart.jsx'
import SortableTable from './SortableTable.jsx'
import { fmtBRL, fmtNum } from '../utils.js'

export default function TabGeografia({ regioes, estados, cidades }) {
  const [subTab, setSubTab] = useState('regiao')
  const [search, setSearch] = useState('')

  const filteredCidades = useMemo(() => {
    if (!search.trim()) return cidades
    const q = search.toLowerCase()
    return cidades.filter((c) => c.cidade.toLowerCase().includes(q) || c.uf.toLowerCase().includes(q))
  }, [cidades, search])

  const regiaoCols = [
    { key: 'nome', label: 'Região' },
    { key: 'qtde', label: 'Qtde', align: 'right', format: fmtNum },
    { key: 'total', label: 'Valor Total (R$)', align: 'right', format: fmtBRL },
    { key: 'pct', label: '%', align: 'right', format: (v) => v + '%' },
  ]
  const cidadeCols = [
    { key: 'cidade', label: 'Cidade' },
    { key: 'uf', label: 'UF' },
    { key: 'qtde', label: 'Qtde', align: 'right', format: fmtNum },
    { key: 'total', label: 'Valor Total (R$)', align: 'right', format: fmtBRL },
    { key: 'pct', label: '%', align: 'right', format: (v) => v + '%' },
  ]

  return (
    <div className="panel">
      <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
      <div className="panel-label">Distribuição Geográfica</div>
      <div className="panel-title">Região · Estado · Cidade</div>

      <div className="sub-tabs">
        <button className={`tab-btn ${subTab === 'regiao' ? 'active' : ''}`} onClick={() => setSubTab('regiao')}>Região</button>
        <button className={`tab-btn ${subTab === 'estado' ? 'active' : ''}`} onClick={() => setSubTab('estado')}>Estado</button>
        <button className={`tab-btn ${subTab === 'cidade' ? 'active' : ''}`} onClick={() => setSubTab('cidade')}>Cidade</button>
      </div>

      {subTab === 'regiao' && (
        <div className="grid-3">
          <Donut items={regioes.map((r) => ({ label: r.nome, value: r.total }))} centerValue={`${regioes.length}`} centerLabel="regiões" />
          <SortableTable columns={regiaoCols} rows={regioes} defaultSortKey="total" />
        </div>
      )}

      {subTab === 'estado' && (
        <BarChart items={estados.map((e) => ({ label: e.uf, value: e.total }))} />
      )}

      {subTab === 'cidade' && (
        <>
          <div className="toolbar">
            <div className="search-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5f6976" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input type="text" placeholder="Buscar cidade ou UF…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="count-badge">{fmtNum(filteredCidades.length)} cidades</div>
          </div>
          <div className="scroll-y">
            <SortableTable columns={cidadeCols} rows={filteredCidades} defaultSortKey="total" />
          </div>
          <div className="footnote">Nomes de cidade normalizados (variações de grafia/acentuação unificadas, ex.: São Paulo / Sao Paulo / São Pualo → São Paulo).</div>
        </>
      )}
    </div>
  )
}
