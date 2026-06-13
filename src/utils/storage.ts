import type { AppData, Branch, Product } from '../types'

const STORAGE_KEY = 'vencimientos_data'

function loadAll(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { branches: [], products: [] }
  } catch {
    return { branches: [], products: [] }
  }
}

function saveAll(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getBranches(): Branch[] {
  return loadAll().branches
}

export function getBranch(id: string): Branch | undefined {
  return loadAll().branches.find((b) => b.id === id)
}

export function saveBranch(branch: Branch): void {
  const data = loadAll()
  const idx = data.branches.findIndex((b) => b.id === branch.id)
  if (idx >= 0) {
    data.branches[idx] = branch
  } else {
    data.branches.push(branch)
  }
  saveAll(data)
}

export function deleteBranch(id: string): void {
  const data = loadAll()
  data.branches = data.branches.filter((b) => b.id !== id)
  data.products = data.products.filter((p) => p.branchId !== id)
  saveAll(data)
}

export function getProducts(): Product[] {
  return loadAll().products
}

export function getBranchProducts(branchId: string): Product[] {
  return loadAll().products.filter((p) => p.branchId === branchId)
}

export function saveProduct(product: Product): void {
  const data = loadAll()
  const idx = data.products.findIndex((p) => p.id === product.id)
  if (idx >= 0) {
    data.products[idx] = product
  } else {
    data.products.push(product)
  }
  saveAll(data)
}

export function removeProduct(id: string): void {
  const data = loadAll()
  const product = data.products.find((p) => p.id === id)
  if (product) {
    product.removedAt = new Date().toISOString()
    saveAll(data)
  }
}

export function getBarcodeHistory(): Map<string, string> {
  const data = loadAll()
  const history = new Map<string, string>()
  for (const p of data.products) {
    if (p.barcode && p.name) {
      history.set(p.barcode, p.name)
    }
  }
  return history
}

export function getAllData(): AppData {
  return loadAll()
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
