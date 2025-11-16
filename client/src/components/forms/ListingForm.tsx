import { useState, type FormEvent } from 'react'
import { propertyStatuses, propertyTypes } from '../../data/properties'
import type { ListingDraft, PropertyStatus, PropertyType } from '../../types'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { createListing } from '../../store/listingsSlice'
import { showToast } from '../../store/uiSlice'

const initialForm = {
  title: '',
  price: '',
  location: '',
  type: 'Căn hộ' as PropertyType,
  status: 'Bán' as PropertyStatus,
  beds: '2',
  baths: '1',
  area: '65',
  description: '',
  contactName: '',
  contactPhone: '',
}

function ListingForm() {
  const dispatch = useAppDispatch()
  const createStatus = useAppSelector((state) => state.listings.createStatus)
  const [form, setForm] = useState(initialForm)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const payload: ListingDraft = {
      title: form.title || 'Tin đăng mới',
      price: Number(form.price) || 0,
      location: form.location || 'Đang cập nhật',
      type: form.type,
      status: form.status,
      beds: Number(form.beds) || 0,
      baths: Number(form.baths) || 0,
      area: Number(form.area) || 0,
      description: form.description,
      contactName: form.contactName,
      contactPhone: form.contactPhone,
    }

    dispatch(createListing(payload))
      .unwrap()
      .then(() => {
        dispatch(showToast('Đăng tin thành công! Tin của bạn đã xuất hiện trong danh sách.'))
        setForm(initialForm)
      })
      .catch(() => {
        dispatch(showToast('Có lỗi khi đăng tin. Vui lòng thử lại.'))
      })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 gap-4 rounded-2xl bg-white p-6 shadow-md shadow-slate-900/5 md:grid-cols-2"
    >
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Tiêu đề tin</label>
        <input
          required
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Giá (VND)</label>
        <input
          required
          type="number"
          min={0}
          value={form.price}
          onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Khu vực</label>
        <input
          required
          value={form.location}
          onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Loại hình</label>
        <select
          value={form.type}
          onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as PropertyType }))}
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        >
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
          value={form.status}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, status: e.target.value as PropertyStatus }))
          }
          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        >
          {propertyStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Diện tích (m²)</label>
        <input
          type="number"
          min={0}
          value={form.area}
          onChange={(e) => setForm((prev) => ({ ...prev, area: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Phòng ngủ</label>
        <input
          type="number"
          min={0}
          value={form.beds}
          onChange={(e) => setForm((prev) => ({ ...prev, beds: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Phòng tắm</label>
        <input
          type="number"
          min={0}
          value={form.baths}
          onChange={(e) => setForm((prev) => ({ ...prev, baths: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </div>
      <div className="space-y-1 md:col-span-2">
        <label className="text-sm font-semibold text-slate-700">Mô tả</label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
          placeholder="Nêu rõ tiện ích, pháp lý, điểm mạnh của bất động sản..."
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Người liên hệ</label>
        <input
          required
          value={form.contactName}
          onChange={(e) => setForm((prev) => ({ ...prev, contactName: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-700">Số điện thoại</label>
        <input
          required
          value={form.contactPhone}
          onChange={(e) => setForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
        />
      </div>

      <div className="md:col-span-2 flex items-center justify-between">
        <p className="text-sm text-slate-600">Tin sẽ hiển thị ngay ở danh sách trang chủ.</p>
        <button
          type="submit"
          disabled={createStatus === 'loading'}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-cyan-600/25 transition hover:-translate-y-0.5 hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {createStatus === 'loading' ? 'Đang đăng...' : 'Đăng tin'}
        </button>
      </div>
    </form>
  )
}

export default ListingForm
