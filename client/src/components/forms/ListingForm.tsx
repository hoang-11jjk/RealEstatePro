import { useRef, useState, type FormEvent } from 'react'
import { propertyStatuses, propertyTypes } from '../../data/properties'
import type { ListingDraft, PropertyStatus, PropertyType } from '../../types'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { createListing } from '../../store/listingsSlice'

import { showToast } from '../../store/uiSlice'
import { uploadToCloudinary } from '../../utils/cloudinary'

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
  const user = useAppSelector((state) => state.auth.user)
  const [form, setForm] = useState(initialForm)

  const [imagePreview, setImagePreview] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsUploading(true)

    try {
      let imageUrl = imagePreview

      if (selectedFile) {
        try {
          imageUrl = await uploadToCloudinary(selectedFile)
        } catch (error) {
          dispatch(showToast('Lỗi khi upload ảnh. Vui lòng thử lại.'))
          setIsUploading(false)
          return
        }
      }

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
        image: imageUrl || undefined,
        ownerEmail: user?.email,
        ownerName: user?.fullName,
      }

      await dispatch(createListing(payload)).unwrap()
      
      dispatch(showToast('Đăng tin thành công! Tin của bạn đã xuất hiện trong danh sách.'))
      setForm(initialForm)
      setImagePreview('')
      setSelectedFile(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch (error) {
      dispatch(showToast('Có lỗi khi đăng tin. Vui lòng thử lại.'))
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="animate-slide-in rounded-2xl bg-gradient-to-br from-white to-slate-50 p-8 shadow-xl shadow-slate-900/10 transition-all duration-300 hover:shadow-2xl"
    >
      <div className="mb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-600 font-semibold">Đăng tin mới</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">Thông tin bất động sản</h3>
        <p className="text-sm text-slate-500 mt-1">Điền đầy đủ thông tin để tin đăng của bạn nổi bật hơn</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="text-cyan-600">●</span> Tiêu đề tin
          </label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="VD: Căn hộ cao cấp view sông Sài Gòn"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300 placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-slate-800">Hình ảnh</label>
          {imagePreview && (
            <div className="overflow-hidden rounded-xl border-2 border-slate-200 bg-slate-50">
              <div
                className="h-48 w-full bg-cover bg-center"
                style={{ backgroundImage: `url(${imagePreview})` }}
              />
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) {
                 setImagePreview('')
                 setSelectedFile(null)
                 return
              }
              setSelectedFile(file)
              const reader = new FileReader()
              reader.onload = () => setImagePreview(String(reader.result))
              reader.readAsDataURL(file)
            }}
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="text-emerald-600">●</span> Giá (VND)
          </label>
          <div className="relative">
            <input
              required
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))}
              placeholder="3000000000"
              className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300 placeholder:text-slate-400"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">đ</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="text-blue-600">●</span> Khu vực
          </label>
          <input
            required
            value={form.location}
            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
            placeholder="Quận 1, TP.HCM"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300 placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-800">Loại hình</label>
          <select
            value={form.type}
            onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as PropertyType }))}
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300 cursor-pointer"
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-800">Trạng thái</label>
          <select
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, status: e.target.value as PropertyStatus }))
            }
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300 cursor-pointer"
          >
            {propertyStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-800">Diện tích (m²)</label>
          <input
            type="number"
            min={0}
            value={form.area}
            onChange={(e) => setForm((prev) => ({ ...prev, area: e.target.value }))}
            placeholder="65"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300 placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-800">Phòng ngủ</label>
          <input
            type="number"
            min={0}
            value={form.beds}
            onChange={(e) => setForm((prev) => ({ ...prev, beds: e.target.value }))}
            placeholder="2"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300 placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-800">Phòng tắm</label>
          <input
            type="number"
            min={0}
            value={form.baths}
            onChange={(e) => setForm((prev) => ({ ...prev, baths: e.target.value }))}
            placeholder="1"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300 placeholder:text-slate-400"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-slate-800">Mô tả chi tiết</label>
          <textarea
            rows={4}
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300 placeholder:text-slate-400 resize-none"
            placeholder="Mô tả chi tiết về bất động sản: vị trí, tiện ích xung quanh, pháp lý, nội thất..."
          />
        </div>

        <div className="md:col-span-2 pt-4 border-t-2 border-slate-100">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold mb-4">Thông tin liên hệ</p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">Người liên hệ</label>
              <input
                required
                value={form.contactName}
                onChange={(e) => setForm((prev) => ({ ...prev, contactName: e.target.value }))}
                placeholder="Nguyễn Văn A"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300 placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-800">Số điện thoại</label>
              <input
                required
                value={form.contactPhone}
                onChange={(e) => setForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
                placeholder="0901 234 567"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-sm outline-none transition-all duration-200 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100 hover:border-slate-300 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <div className="md:col-span-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t-2 border-slate-100">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-cyan-50 p-2 mt-0.5">
              <svg className="h-5 w-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">Tin sẽ được duyệt tự động</p>
              <p className="text-xs text-slate-500 mt-0.5">Tin đăng của bạn sẽ xuất hiện ngay trong danh sách trang chủ</p>
            </div>
          </div>
          <button
            type="submit"
            disabled={createStatus === 'loading' || isUploading}
            className="group relative w-full sm:w-auto overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-600/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-600/40 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 active:translate-y-0"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {createStatus === 'loading' || isUploading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isUploading ? 'Đang tải ảnh...' : 'Đang đăng tin...'}
                </>
              ) : (
                <>
                  Đăng tin ngay
                  <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </span>
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        </div>
      </div>
    </form>
  )
}

export default ListingForm
