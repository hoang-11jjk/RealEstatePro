import { Filter } from 'lucide-react'
import { propertyStatuses, propertyTypes } from '../data/properties'
import type { FiltersState } from '../store/filtersSlice'

type Props = {
  filters: FiltersState
  onChange: (field: keyof FiltersState, value: string) => void
  onClear: () => void
  matchCount: number
}

function SearchFilters({ filters, onChange, onClear, matchCount }: Props) {
  return (
    <section id="search-section" className="animate-slide-in rounded-2xl bg-white p-6 shadow-md shadow-slate-900/5 transition-shadow duration-300 hover:shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-600">Bộ lọc thông minh</p>
          <h3 className="text-xl font-bold text-slate-900">Tìm kiếm bất động sản phù hợp</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">
          <Filter className="h-4 w-4" />
          {matchCount} tin phù hợp
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Từ khóa</label>
          <input
            value={filters.keyword}
            onChange={(e) => onChange('keyword', e.target.value)}
            placeholder="VD: căn hộ, nhà phố..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 hover:border-slate-300"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Khu vực</label>
          <input
            value={filters.location}
            onChange={(e) => onChange('location', e.target.value)}
            placeholder="Quận, huyện, thành phố..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 hover:border-slate-300"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Loại hình</label>
          <select
            value={filters.type}
            onChange={(e) => onChange('type', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 hover:border-slate-300 cursor-pointer"
          >
            <option value="">Tất cả</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Trạng thái</label>
          <select
            value={filters.status}
            onChange={(e) => onChange('status', e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 hover:border-slate-300 cursor-pointer"
          >
            <option value="">Tất cả</option>
            {propertyStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Giá từ (VND)</label>
          <input
            type="number"
            min={0}
            value={filters.minPrice}
            onChange={(e) => onChange('minPrice', e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700">Đến (VND)</label>
          <input
            type="number"
            min={0}
            value={filters.maxPrice}
            onChange={(e) => onChange('maxPrice', e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Bộ lọc theo vị trí, loại hình, khoảng giá. Kết quả cập nhật ngay khi bạn nhập.
        </p>
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-semibold text-cyan-700 underline underline-offset-4 transition-all duration-200 hover:text-cyan-800 hover:decoration-2"
        >
          Xóa bộ lọc
        </button>
      </div>
    </section>
  )
}

export default SearchFilters
