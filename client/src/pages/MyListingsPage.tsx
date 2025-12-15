import { useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import type { Property } from '../types'
import { useAppSelector } from '../store/hooks'

function MyListingsPage() {
  const user = useAppSelector((s) => s.auth.user)
  const [items, setItems] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<{ title: string; price: string }>({ title: '', price: '' })

  const load = () => {
    setLoading(true)
    setError(null)
    api
      .get<Property[]>('/properties')
      .then((r) => setItems(r.data))
      .catch((e) => setError(e.message || 'Không thể tải'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const myItems = useMemo(
    () => items.filter((p) => (user?.email ? p.ownerEmail === user.email : false)),
    [items, user?.email],
  )

  const toggleVisibility = async (id: number, next: 'approved' | 'hidden') => {
    await api.patch(`/properties/${id}`, { visibility: next })
    load()
  }

  const remove = async (id: number) => {
    await api.delete(`/properties/${id}`)
    load()
  }

  const startEdit = (p: Property) => {
    setEditingId(p.id)
    setDraft({ title: p.title, price: String(p.price) })
  }

  const saveEdit = async () => {
    if (!editingId) return
    await api.patch(`/properties/${editingId}`, { title: draft.title, price: Number(draft.price) || 0 })
    setEditingId(null)
    load()
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-600">Quản lý tin của tôi</p>
        <h2 className="text-2xl font-bold">Xin chào {user?.fullName}</h2>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm">Đang tải...</div>
      ) : error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>
      ) : myItems.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm">Bạn chưa có tin nào.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-2 text-left">Tiêu đề</th>
                <th className="px-4 py-2 text-left">Giá</th>
                <th className="px-4 py-2 text-left">Trạng thái</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {myItems.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-2">
                    {editingId === p.id ? (
                      <input
                        value={draft.title}
                        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                        className="w-full rounded-md border border-slate-200 px-2 py-1"
                      />
                    ) : (
                      p.title
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {editingId === p.id ? (
                      <input
                        value={draft.price}
                        onChange={(e) => setDraft((d) => ({ ...d, price: e.target.value }))}
                        className="w-28 rounded-md border border-slate-200 px-2 py-1"
                      />
                    ) : (
                      p.price.toLocaleString('vi-VN') + ' ₫'
                    )}
                  </td>
                  <td className="px-4 py-2">{p.visibility ?? 'approved'}</td>
                  <td className="px-4 py-2 text-right space-x-2">
                    {editingId === p.id ? (
                      <>
                        <button className="rounded bg-cyan-600 px-3 py-1 text-white" onClick={saveEdit}>
                          Lưu
                        </button>
                        <button className="rounded bg-slate-100 px-3 py-1" onClick={() => setEditingId(null)}>
                          Hủy
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="rounded bg-slate-100 px-3 py-1" onClick={() => startEdit(p)}>
                          Sửa
                        </button>
                        {p.visibility === 'hidden' ? (
                          <button className="rounded bg-emerald-600 px-3 py-1 text-white" onClick={() => toggleVisibility(p.id, 'approved')}>
                            Hiện
                          </button>
                        ) : (
                          <button className="rounded bg-amber-600 px-3 py-1 text-white" onClick={() => toggleVisibility(p.id, 'hidden')}>
                            Ẩn
                          </button>
                        )}
                        <button className="rounded bg-rose-600 px-3 py-1 text-white" onClick={() => remove(p.id)}>
                          Xóa
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyListingsPage
