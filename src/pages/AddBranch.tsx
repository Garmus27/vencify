import { Link } from 'react-router-dom'
import AddBranchForm from '../components/AddBranchForm'

export default function AddBranch() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-4">
        <Link
          to="/branches"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-xl text-gray-300"
        >
          ←
        </Link>
        <h1 className="text-xl font-bold text-white">Nueva Sucursal</h1>
      </div>

      <AddBranchForm />
    </div>
  )
}
