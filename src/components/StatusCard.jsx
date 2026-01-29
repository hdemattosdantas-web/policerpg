export function StatusCard({ title, value, subtitle }) {
  return (
    <div className="card">
      <div className="card__title">{title}</div>
      <div className="card__value">{value}</div>
      {subtitle ? <div className="card__subtitle">{subtitle}</div> : null}
    </div>
  )
}
