import client from './client'

// ─── Auth ──────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    client.post('/auth/login', { email, password }),

  register: (name: string, email: string, password: string) =>
    client.post('/auth/register', { name, email, password }),

  me: () => client.get('/auth/me'),

  loginStaff: (email: string, password: string) =>
    client.post('/auth/login/staff', { email, password }),
}

// ─── Reports ───────────────────────────────────────────
export const reportsApi = {
  create: (data: unknown) =>
    client.post('/reports/', data),

  aiClassify: (photo_url: string) =>
    client.post('/reports/ai-classify', { photo_url }),

  classifyUpload: (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return client.post('/reports/classify-upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  mine: (status?: string) =>
    client.get('/reports/mine', { params: status ? { status } : {} }),

  all: (params?: Record<string, string>) =>
    client.get('/reports', { params }),

  get: (id: string) =>
    client.get(`/reports/${id}`),

  updateStatus: (id: string, status: string) =>
    client.patch(`/reports/${id}/status`, { status }),

  slaReport: (id: string, report_text: string, recommended_action: string, severity: string) =>
    client.post(`/reports/${id}/sla-report`, { report_text, recommended_action, severity }),

  exportCsv: (params?: Record<string, string>) => {
    const token = localStorage.getItem('apexcore_token')
    const qs = new URLSearchParams({ ...(params ?? {}), token: token ?? '' })
    window.open(`/api/v1/reports/export?${qs}`, '_blank')
  },
}

// ─── Proposals ─────────────────────────────────────────
export const proposalsApi = {
  list: (tag?: string) =>
    client.get('/proposals', { params: tag ? { tag } : {} }),

  create: (title: string, description: string, tag: string) =>
    client.post('/proposals/', { title, description, tag }),

  vote: (id: string) =>
    client.post(`/proposals/${id}/vote`),
}

// ─── Alerts ────────────────────────────────────────────
export const alertsApi = {
  list: (type?: string) =>
    client.get('/alerts', { params: type ? { type } : {} }),

  create: (title: string, body: string, type: string, district: string) =>
    client.post('/alerts/', { title, body, type, district }),

  delete: (id: string) =>
    client.delete(`/alerts/${id}`),
}

// ─── Tasks ─────────────────────────────────────────────
export const tasksApi = {
  mine: () => client.get('/tasks/mine'),

  get: (id: string) => client.get(`/tasks/${id}`),

  updateStatus: (id: string, status: string) =>
    client.patch(`/tasks/${id}/status`, { status }),

  uploadProof: (id: string, file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    return client.post(`/tasks/${id}/proof`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  create: (report_id: string, inspector_id: string, deadline: string) =>
    client.post('/tasks/', { report_id, inspector_id, deadline }),
}

// ─── Analytics ─────────────────────────────────────────
export const analyticsApi = {
  summary: () =>
    client.get('/analytics/summary'),

  byNeighborhood: () =>
    client.get('/analytics/by-neighborhood'),

  byCategory: () =>
    client.get('/analytics/by-category'),

  monthlyTrend: (year?: number) =>
    client.get('/analytics/monthly-trend', { params: year ? { year } : {} }),

  agencyPerformance: () =>
    client.get('/analytics/agency-performance'),

  slaBreaches: () =>
    client.get('/analytics/sla-breaches'),
}

// ─── Simulation ────────────────────────────────────────
export const simulationApi = {
  layers: (lat: number, lng: number) =>
    client.get('/simulation/layers', { params: { lat, lng } }),

  run: (task_id: string, active_layers: string[], lat: number, lng: number) =>
    client.post('/simulation/run', { task_id, active_layers, lat, lng }),

  riskAssess: (task_id: string) =>
    client.post('/simulation/risk-assess', { task_id }),
}
