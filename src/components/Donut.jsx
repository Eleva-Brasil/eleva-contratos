import { buildConicGradient, fmtBRL0, COLORS } from '../utils.js'

export default function Donut({ items, centerLabel, centerValue }) {
  const gradient = buildConicGradient(items)
  return (
    <div className="donut-wrap">
      <div className="donut" style={{ background: gradient }}>
        <div className="donut-hole">
          <div className="dh-value">{centerValue}</div>
          <div className="dh-label">{centerLabel}</div>
        </div>
      </div>
      <div className="legend">
        {items.map((item, i) => (
          <div className="legend-item" key={item.label}>
            <span className="legend-dot" style={{ background: COLORS[i % COLORS.length] }} />
            <span className="legend-label">{item.label}</span>
            <span className="legend-val">{fmtBRL0(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
