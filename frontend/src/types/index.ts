export type Role = 'citizen' | 'inspector' | 'executive'
export type ReportStatus = 'pending' | 'inprogress' | 'resolved' | 'overdue'
export type AlertType = 'info' | 'warning' | 'success'
export type Priority = 'high' | 'medium' | 'low'

export interface Report {
  id: string
  report_id?: string
  title: string
  status: ReportStatus
  date?: string
  address?: string
  ai_routed?: string
  category?: string
  description?: string
  neighborhood?: string
  citizen?: string
  assigned_to?: string
  submitted_date?: string
  resolved_date?: string | null
  deadline_date?: string
  deadline_passed?: boolean
}

export interface Proposal {
  id: string
  title: string
  description: string
  author: string
  date: string
  votes: number
  voted_by_me: boolean
  tag: string
}

export interface GovAlert {
  id: string
  title: string
  body: string
  type: AlertType
  district: string
  date: string
  time?: string
}

export interface Task {
  id: string
  title: string
  address: string
  category: string
  priority: Priority
  status: ReportStatus
  citizen?: { name: string; phone: string }
  date: string
  description?: string
  agency_body?: string
  agency_requirements?: string[]
  map_x?: number
  map_y?: number
}

export interface KPISummary {
  total: number
  resolved: number
  open: number
  sla_breaches: number
}

export interface NeighborhoodStat {
  name: string
  resolved: number
  open: number
  overdue: number
}

export interface CategoryStat {
  name: string
  value: number
  color: string
}

export interface MonthlyTrend {
  month: string
  submitted: number
  resolved: number
}

export interface AgencyPerformance {
  agency: string
  compliance_pct: number
  avg_resolution_hours?: number
}

export interface SLABreach {
  report_id: string
  title: string
  neighborhood: string
  assigned_to: string
  overdue_days: number
  severity: 'critical' | 'high'
}

export interface AgencyRequest {
  id: string
  title: string
  from_agency: string
  to_agency: string
  location: string
  status: ReportStatus
  sent_date: string
  deadline_date: string
  sla_days: number
  note?: string
}

export interface SimLayer {
  key: string
  label: string
  risk_level: 'low' | 'medium' | 'high'
  risk_label: string
  details: { k: string; v: string }[]
  warning?: string
}
