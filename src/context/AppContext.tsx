import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { AppData, Branch, Product } from '../types'
import { generateId } from '../utils/storage'

const STORAGE_KEY = 'vencimientos_data'

type Action =
  | { type: 'SET_DATA'; payload: AppData }
  | { type: 'ADD_BRANCH'; payload: Branch }
  | { type: 'UPDATE_BRANCH'; payload: Branch }
  | { type: 'DELETE_BRANCH'; payload: string }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'REMOVE_PRODUCT'; payload: string }

function reducer(state: AppData, action: Action): AppData {
  switch (action.type) {
    case 'SET_DATA':
      return action.payload
    case 'ADD_BRANCH':
      return { ...state, branches: [...state.branches, action.payload] }
    case 'UPDATE_BRANCH':
      return {
        ...state,
        branches: state.branches.map((b) =>
          b.id === action.payload.id ? action.payload : b,
        ),
      }
    case 'DELETE_BRANCH':
      return {
        branches: state.branches.filter((b) => b.id !== action.payload),
        products: state.products.filter((p) => p.branchId !== action.payload),
      }
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] }
    case 'REMOVE_PRODUCT':
      return {
        ...state,
        products: state.products.map((p) =>
          p.id === action.payload
            ? { ...p, removedAt: new Date().toISOString() }
            : p,
        ),
      }
    default:
      return state
  }
}

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : { branches: [], products: [] }
  } catch {
    return { branches: [], products: [] }
  }
}

interface AppContextType {
  state: AppData
  dispatch: React.Dispatch<Action>
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, loadData)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export function useBranches() {
  const { state, dispatch } = useApp()
  return {
    branches: state.branches,
    addBranch: (data: Omit<Branch, 'id'>) => {
      const branch: Branch = { ...data, id: generateId() }
      dispatch({ type: 'ADD_BRANCH', payload: branch })
    },
    updateBranch: (branch: Branch) =>
      dispatch({ type: 'UPDATE_BRANCH', payload: branch }),
    deleteBranch: (id: string) =>
      dispatch({ type: 'DELETE_BRANCH', payload: id }),
  }
}

export function useProducts() {
  const { state, dispatch } = useApp()
  return {
    products: state.products,
    addProduct: (data: Omit<Product, 'id' | 'createdAt'>) => {
      const product: Product = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }
      dispatch({ type: 'ADD_PRODUCT', payload: product })
    },
    removeProduct: (id: string) =>
      dispatch({ type: 'REMOVE_PRODUCT', payload: id }),
  }
}
