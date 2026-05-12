interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-paper border border-rule rounded-[16px] p-6 ${
        onClick ? 'cursor-pointer transition-shadow hover:shadow-sm' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
