// Hand-drawn style sunflower in SVG, used as decoration around the site.
export default function SunflowerArt({ className = '', petals = 18 }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <g transform="translate(60 60)">
        {Array.from({ length: petals }, (_, i) => (
          <ellipse key={`b${i}`} rx="9" ry="30" fill="#eab308" transform={`rotate(${(360 / petals) * i + 10}) translate(0 -26)`} />
        ))}
        {Array.from({ length: petals }, (_, i) => (
          <ellipse key={`f${i}`} rx="8" ry="27" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" transform={`rotate(${(360 / petals) * i}) translate(0 -24)`} />
        ))}
        <circle r="22" fill="#5b3412" />
        <circle r="16" fill="#3b200a" />
        {Array.from({ length: 22 }, (_, i) => {
          const a = i * 2.4
          const r = 3 + i * 0.75
          return <circle key={`s${i}`} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r="1.4" fill="#7c4a1e" />
        })}
      </g>
    </svg>
  )
}
