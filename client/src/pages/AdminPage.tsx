import { useEffect, useState } from 'react'
import { api } from '../api'
import type { Property } from '../types'

type Stat = { location: string; count: number }

function AdminPage() {
  const [items, setItems] = useState<Property[]>([])
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    setError(null)
    Promise.all([api.get<Property[]>('/properties'), api.get<Stat[]>('/stats/by-location')])
      .then(([a, b]) => {
        setItems(a.data)
        setStats(b.data as any)
      })
      .catch((e) => setError(e.message || 'Không thể tải'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const moderate = async (id: number, v: 'approved' | 'hidden' | 'pending') => {
    await api.patch(`/properties/${id}/moderation`, { visibility: v })
    load()
  }

  const remove = async (id: number) => {
    await api.delete(`/properties/${id}`)
    load()
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-600">Quản trị</p>
        <h2 className="text-2xl font-bold">Duyệt tin và thống kê</h2>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm">Đang tải...</div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 overflow-x-auto rounded-xl bg-white shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-2 text-left">Tiêu đề</th>
                  <th className="px-4 py-2 text-left">Người đăng</th>
                  <th className="px-4 py-2 text-left">Trạng thái</th>
                  <th className="px-4 py-2" />
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-2">{p.title}</td>
                    <td className="px-4 py-2">{p.ownerEmail ?? 'N/A'}</td>
                    <td className="px-4 py-2">{(p as any).visibility ?? 'approved'}</td>
                    <td className="px-4 py-2 text-right space-x-2">
                      <button className="rounded bg-emerald-600 px-3 py-1 text-white" onClick={() => moderate(p.id, 'approved')}>
                        Duyệt
                      </button>
                      <button className="rounded bg-amber-600 px-3 py-1 text-white" onClick={() => moderate(p.id, 'hidden')}>
                        Ẩn
                      </button>
                      <button className="rounded bg-rose-600 px-3 py-1 text-white" onClick={() => remove(p.id)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-800">Thống kê tin theo khu vực</p>
            <div className="space-y-2">
              {stats.map((s) => (
                <div key={s.location} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span className="text-sm text-slate-700">{s.location}</span>
                  <span className="text-sm font-bold text-slate-900">{s.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPage
