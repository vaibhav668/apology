import Reveal from './Reveal'

export default function SectionHeading({ eyebrow, title, sub, align = 'center', className = '' }) {
  const alignCls = align === 'left' ? 'text-left items-start' : 'text-center items-center'
  return (
    <div className={`flex flex-col gap-4 ${alignCls} ${className}`}>
      {eyebrow && (
        <Reveal>
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
      )}
      <Reveal delay={0.08}>
        <h2 className="font-display text-[2.1rem] leading-[1.08] font-semibold text-white sm:text-5xl md:text-6xl text-balance">
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.16}>
          <p className="max-w-xl text-[0.98rem] leading-relaxed text-lilac-200/75 sm:text-lg text-pretty">{sub}</p>
        </Reveal>
      )}
    </div>
  )
}
