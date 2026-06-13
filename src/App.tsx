import { HashRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Branches from './pages/Branches'
import BranchDetail from './pages/BranchDetail'
import AddBranch from './pages/AddBranch'
import Reports from './pages/Reports'

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/branches/new" element={<AddBranch />} />
            <Route path="/branches/:id" element={<BranchDetail />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppProvider>
  )
}
