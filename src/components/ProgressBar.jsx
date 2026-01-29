export function ProgressBar({ value }) {
  const safeValue = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0))

  return (
    <div className="progress">
      <div className="progress__bar" style={{ width: `${safeValue}%` }} />
    </div>
  )
}
