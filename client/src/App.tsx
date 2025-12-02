import { Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import PostPage from './pages/PostPage'
import ProtectedRoute from './routes/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import ListingsPage from './pages/ListingsPage'
import DetailPage from './pages/DetailPage'
import MyListingsPage from './pages/DetailPage'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/listings/:id" element={<DetailPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/post" element={<PostPage />} />
          <Route path="/me/listings" element={<MyListingsPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Route>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
