import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Crumb {
  label: string
  to?: string
}

export default function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-muted">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={14} />}
          {c.to ? (
            <Link to={c.to} className="hover:text-primary transition-colors">
              {c.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-medium">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
