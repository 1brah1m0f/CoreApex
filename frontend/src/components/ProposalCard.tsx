import { User, Calendar, ThumbsUp, Loader2 } from 'lucide-react'
import { Proposal } from '../types'
import Button from './ui/Button'

interface ProposalCardProps {
  proposal: Proposal
  onVote?: (id: string) => void
  voting?: boolean
}

export default function ProposalCard({ proposal, onVote, voting }: ProposalCardProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-card border border-border">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h3 className="font-medium text-gray-900">{proposal.title}</h3>
          <p className="text-sm text-muted mt-1 line-clamp-2">{proposal.description}</p>
        </div>
        <span className="text-xs bg-blue-50 text-primary rounded-full px-2 py-0.5 whitespace-nowrap">
          {proposal.tag}
        </span>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-3 text-xs text-muted">
          <span className="flex items-center gap-1"><User size={12} /> {proposal.author}</span>
          <span className="flex items-center gap-1"><Calendar size={12} /> {proposal.date}</span>
        </div>
        {onVote && (
          <Button 
            variant="ghost" 
            onClick={() => onVote(proposal.id)} 
            disabled={voting}
            className="h-8 text-xs gap-1 px-2"
          >
            {voting ? <Loader2 size={14} className="animate-spin" /> : <ThumbsUp size={14} />}
            <span>{(proposal as any).votes || 0}</span>
          </Button>
        )}
      </div>
    </div>
  )
}
