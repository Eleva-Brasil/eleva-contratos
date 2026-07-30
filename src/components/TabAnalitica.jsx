import { useMemo, useState } from 'react'
import SortableTable from './SortableTable.jsx'
import { fmtBRL, fmtNum } from '../utils.js'

export default function TabAnalitica({ rows, vendedores }) {
  const [vendorFilter, setVendorFilter] = useState('Todos')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let r = rows
    if (vendorFilter !== 'Todos') r = r.filter((row) => row.vendedor === vendorFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      r = r.filter(
        (row) =>
          row.cliente.toLowerCase().includes(q) ||
          row.perfil.toLowerCase().includes(q) ||
          row.apelido.toLowerCase().includes(q) ||
          row.serie.toLowerCase().includes(q) ||
          String(row.contrato).toLowerCase().includes(q) ||
          row.cidade.toLowerCase().includes(q)
      )
    }
    return r
  }, [rows, vendorFilter, search])

  const subtotal = useMemo(() => filtered.reduce((acc, r) => acc + r.total, 0), [filtered])

  const columns = [
    { key: 'vendedor', label: 'Vendedor' },
    { key: 'contrato', label: 'Contrato' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'perfil', label: 'Perfil' },
    { key: 'modelo', label: 'Categoria' },
    { key: 'apelido', label: 'Apelido' },
    { key: 'serie', label: 'Nº Série' },
    { key: 'cidade', label: 'Cidade' },
    { key: 'estado', label: 'UF' },
    { key: 'equip', label: 'Equip. (R$)', align: 'right', format: fmtBRL },
    { key: 'oper', label: 'Oper. (R$)', align: 'right', format: fmtBRL },
    { key: 'total', label: 'Total (R$)', align: 'right', format: fmtBRL },
  ]

  return (
    <div className="panel">
      <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
      <div className="panel-label">Detalhamento</div>
      <div className="panel-title">Equipamentos por Vendedor <span className="tag">{fmtNum(rows.length)} linhas</span></div>

      <div className="toolbar">
        <div className="search-box" style={{ maxWidth: 260 }}>
          <select
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            style={{ background: 'transparent', color: 'var(--text)', border: 'none', outline: 'none', width: '100%', fontFamily: 'var(--body)', fontSize: 13 }}
          >
            <option value="Todos">Todos os vendedores</option>
            {vendedores.map((v) => (
              <option key={v.nome} value={v.nome}>{v.nome}</option>
            ))}
          </select>
        </div>
        <div className="search-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5f6976" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Buscar cliente, perfil, apelido, série, contrato ou cidade…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="count-badge">
          {fmtNum(filtered.length)} equip. · Subtotal {fmtBRL(subtotal)}
        </div>
      </div>

      <div className="scroll-y">
        <SortableTable columns={columns} rows={filtered} defaultSortKey="vendedor" defaultSortDir="asc" />
      </div>
    </div>
  )
}
