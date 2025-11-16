import ListingForm from '../components/forms/ListingForm'
import { useAppSelector } from '../store/hooks'

function PostPage() {
  const user = useAppSelector((state) => state.auth.user)

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-6 shadow-md shadow-slate-900/5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-600">Đăng tin nhà đất</p>
        <h2 className="text-2xl font-bold text-slate-900">Tạo tin đăng mới</h2>
        <p className="text-sm text-slate-600">
          Chào {user?.fullName || 'bạn'}, vui lòng nhập thông tin chi tiết để bài đăng hiển thị nổi bật.
        </p>
      </div>
      <ListingForm />
    </div>
  )
}

export default PostPage
