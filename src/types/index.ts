export interface Branch {
  id: string
  chain: string
  name: string
  warningDays: number
  criticalDays: number
}

export interface Product {
  id: string
  branchId: string
  barcode: string
  name: string
  expiryDate: string
  quantity: number
  createdAt: string
  removedAt: string | null
}

export interface AppData {
  branches: Branch[]
  products: Product[]
}

export type AlertStatus = 'critical' | 'warning' | 'ok'

export type SortMode = 'priority' | 'branch'

export interface DaysRemaining {
  days: number
  status: AlertStatus
}
