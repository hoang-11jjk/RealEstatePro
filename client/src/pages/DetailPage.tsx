import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api'
import type { Property } from '../types'
import { priceFormatter } from '../utils/format'
import { useAppDispatch } from '../store/hooks'
import { showToast } from '../store/uiSlice'

function DetailPage() {
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const [data, setData] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    api
      .get<Property>(`/properties/${id}`)
      .then((r) => setData(r.data))
      .catch((e) => setError(e.message || 'Không tải được tin'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Đang tải chi tiết...
      </div>
    )
  if (error)
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">{error}</div>
    )
  if (!data)
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
        Không tìm thấy tin.
      </div>
    )

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="rounded-2xl bg-white p-4 shadow-sm lg:col-span-2">
        <div
          className="h-72 w-full rounded-xl bg-cover bg-center"
          style={{ backgroundImage: `url(${data.image})` }}
        />
        <div className="mt-4 space-y-2">
          <h1 className="text-2xl font-black text-slate-900">{data.title}</h1>
          <p className="text-xl font-black text-slate-900">{priceFormatter.format(data.price)}</p>
          <p className="text-sm text-slate-600">{data.location}</p>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
            <span className="rounded-lg bg-slate-100 px-2 py-1">{data.beds} PN</span>
            <span className="rounded-lg bg-slate-100 px-2 py-1">{data.baths} WC</span>
            <span className="rounded-lg bg-slate-100 px-2 py-1">{data.area} m²</span>
            <span className="rounded-lg bg-slate-100 px-2 py-1">{data.type}</span>
          </div>
          <p className="text-sm text-slate-700">{data.description}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-700">Liên hệ người đăng</p>
        <p className="mt-1 text-base font-semibold text-slate-900">{data.contactName}</p>
        <p className="text-sm text-slate-700">{data.contactPhone}</p>

        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            if (!message.trim()) return
            dispatch(showToast('Đã gửi yêu cầu liên hệ tới người đăng.'))
            setMessage('')
          }}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Tin nhắn tới người đăng..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white hover:bg-cyan-700"
          >
            Gửi liên hệ
          </button>
        </form>

        <Link to="/listings" className="mt-4 inline-block text-sm text-cyan-700 underline">
          ← Quay lại danh sách
        </Link>
      </div>
    </div>
  )
}

export default DetailPage
