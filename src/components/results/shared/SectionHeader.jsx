export default function SectionHeader({ id, label, subtitle }) {
  return (
    <div id={id} className="mb-5 scroll-mt-20">
      <div
        className="uppercase tracking-[3px]"
        style={{
          fontSize: 10,
          color: 'var(--color-text-muted)',
          fontFamily: 'var(--font-body)',
          marginBottom: subtitle ? 4 : 0,
        }}
      >
        {label}
      </div>
      {subtitle && (
        <div
          style={{
            fontSize: 12,
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  )
}
