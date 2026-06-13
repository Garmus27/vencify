import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col bg-gray-950">
      <main className="flex-1 overflow-y-auto px-5 pb-28 pt-5">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}
