import { useMemo, useState } from 'react'

/**
 * Generic sortable table.
 * columns: [{ key, label, align: 'left'|'right', format: (v,row)=>node }]
 */
export default function SortableTable({ columns, rows, defaultSortKey, defaultSortDir = 'desc' }) {
  const [sortKey, setSortKey] = useState(defaultSortKey || columns[0].key)
  const [sortDir, setSortDir] = useState(defaultSortDir)

  const sorted = useMemo(() => {
    const copy = [...rows]
    copy.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]
      let cmp
      if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv
      else cmp = String(av).localeCompare(String(bv), 'pt-BR')
      return sortDir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [rows, sortKey, sortDir])

  function toggleSort(key) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              onClick={() => toggleSort(col.key)}
              style={{ textAlign: col.align === 'right' ? 'right' : 'left' }}
            >
              {col.label}
              {sortKey === col.key && <span className="arrow">{sortDir === 'asc' ? '▲' : '▼'}</span>}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((row, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td key={col.key} className={col.align === 'right' ? 'num' : ''}>
                {col.format ? col.format(row[col.key], row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
