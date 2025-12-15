import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SearchFilters from '../components/SearchFilters'
import PropertyGrid from '../components/PropertyGrid'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { clearFilters, setFilter } from '../store/filtersSlice'
import { api } from '../api'
import type { Property } from '../types'

type PagedResponse = { items: Property[]; total: number; page: number; limit: number }

function ListingsPage() {
  const dispatch = useAppDispatch()
  const filters = useAppSelector((s) => s.filters)
  const [searchParams, setSearchParams] = useSearchParams()

  const [data, setData] = useState<PagedResponse>({ items: [], total: 0, page: 1, limit: 9 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  const page = Number(searchParams.get('page') || 1)

  const params = useMemo(() => {
    const p: Record<string, string> = {
      _page: String(page),
      _limit: '9',
      q: filters.keyword,
      location_like: filters.location,
      type: filters.type,
      status: filters.status,
      price_gte: filters.minPrice,
      price_lte: filters.maxPrice,
      visibility: 'approved',
    }
    Object.keys(p).forEach((k) => {
      if (p[k] === '' || p[k] === '0' || p[k] === undefined) delete p[k]
    })
    return p
  }, [filters, page])

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    api
      .get<Property[]>('/properties', { params })
      .then((res) => {
        if (!mounted) return
        const total = Number(res.headers['x-total-count'] || res.data.length || 0)
        setData({
          items: res.data,
          total,
          page,
          limit: 9
        })
        setSelectedId(res.data[0]?.id ?? null)
      })
      .catch((e) => setError(e.message || 'Không thể tải danh sách'))
      .finally(() => setLoading(false))
    return () => {
      mounted = false
    }
  }, [params])

  const totalPages = Math.max(1, Math.ceil(data.total / data.limit))

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-md shadow-slate-900/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-600">Danh sách</p>
            <h2 className="text-2xl font-bold text-slate-900">Tin bất động sản</h2>
          </div>
          <Link
            to="/"
            className="rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Về trang chủ
          </Link>
        </div>
      </div>

      <SearchFilters
        filters={filters}
        onChange={(field, value) => {
          setSearchParams({ page: '1' })
          dispatch(setFilter({ field, value }))
        }}
        onClear={() => {
          setSearchParams({ page: '1' })
          dispatch(clearFilters())
        }}
        matchCount={data.total}
      />

      <PropertyGrid
        properties={data.items}
        selectedId={selectedId}
        onSelect={setSelectedId}
        isLoading={loading}
        error={error}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm disabled:opacity-50"
            onClick={() => setSearchParams({ page: String(Math.max(1, page - 1)) })}
            disabled={page <= 1}
          >
            Trang trước
          </button>
          <span className="text-sm text-slate-600">
            Trang {page} / {totalPages}
          </span>
          <button
            className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm disabled:opacity-50"
            onClick={() => setSearchParams({ page: String(Math.min(totalPages, page + 1)) })}
            disabled={page >= totalPages}
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  )
}

export default ListingsPage
