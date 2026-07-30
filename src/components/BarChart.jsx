import { fmtBRL0 } from '../utils.js'

export default function BarChart({ items }) {
  const max = Math.max(...items.map((i) => i.value))
  return (
    <div className="bar-chart">
      {items.map((item) => (
        <div className="bar-col" key={item.label}>
          <div className="bar-val">{fmtBRL0(item.value)}</div>
          <div className="bar" style={{ height: `${(item.value / max) * 100}%` }} />
          <div className="bar-label">{item.label}</div>
        </div>
      ))}
    </div>
  )
}
