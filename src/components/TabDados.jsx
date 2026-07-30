import { useMemo, useState } from 'react'
import SortableTable from './SortableTable.jsx'
import { fmtBRL, fmtNum } from '../utils.js'

export default function TabDados({ rows }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return rows
    const q = search.toLowerCase()
    return rows.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q))
    )
  }, [rows, search])

  const columns = [
    { key: 'contrato', label: 'Contrato' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'vendedor', label: 'Vendedor' },
    { key: 'serie', label: 'Nº Série' },
    { key: 'perfil', label: 'Perfil' },
    { key: 'modelo', label: 'Categoria' },
    { key: 'apelido', label: 'Apelido' },
    { key: 'equip', label: 'Equip. (R$)', align: 'right', format: fmtBRL },
    { key: 'oper', label: 'Oper. (R$)', align: 'right', format: fmtBRL },
    { key: 'total', label: 'Total (R$)', align: 'right', format: fmtBRL },
    { key: 'cidade', label: 'Cidade' },
    { key: 'estado', label: 'UF' },
    { key: 'regiao', label: 'Região' },
  ]

  return (
    <div className="panel">
      <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
      <div className="panel-label">Base Completa</div>
      <div className="panel-title">Dados Tratados <span className="tag">{fmtNum(rows.length)} registros</span></div>

      <div className="toolbar">
        <div className="search-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5f6976" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input type="text" placeholder="Buscar em qualquer campo…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="count-badge">{fmtNum(filtered.length)} de {fmtNum(rows.length)} registros</div>
      </div>

      <div className="scroll-y">
        <SortableTable columns={columns} rows={filtered} defaultSortKey="contrato" defaultSortDir="desc" />
      </div>

      <div className="footnote">
        Base limpa: linhas em branco e sem Nº de série já excluídas · Faturamento = Equipamentos + Operadores (Frete e Adicional não considerados).
      </div>
    </div>
  )
}
