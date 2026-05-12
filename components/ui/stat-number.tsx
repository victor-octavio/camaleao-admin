import { ArrowUpRight } from 'lucide-react'

interface StatNumberProps {
  value: string
  label: string
  accentClass?: string
  trend?: string
}

export function StatNumber({
  value,
  label,
  accentClass = 'text-ink',
  trend,
}: StatNumberProps) {
  return (
    <div>
      <div className="text-[13px] text-muted font-body mb-2 tracking-wide">
        {label}
      </div>
      <div className="flex items-baseline gap-2.5">
        <div
          className={`text-[38px] font-display font-bold tracking-[-1.2px] leading-none ${accentClass}`}
        >
          {value}
        </div>
        {trend && (
          <div className="text-xs text-emerald font-body flex items-center gap-0.5">
            <ArrowUpRight size={12} />
            {trend}
          </div>
        )}
      </div>
    </div>
  )
}
