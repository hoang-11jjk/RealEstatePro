import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_PATH = path.join(__dirname, 'db.json')
const PORT = process.env.PORT || 4000

async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8')
    return JSON.parse(raw || '{}')
  } catch {
    return { properties: [] }
  }
}

async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8')
}

async function ensureDb() {
  const db = await readDb()
  if (!db.properties || !Array.isArray(db.properties)) {
    db.properties = []
    await writeDb(db)
  }
}

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/properties', async (req, res) => {
  const db = await readDb()
  const list = db.properties ?? []

  // Filters & pagination via query params
  const {
    q = '',
    location = '',
    type = '',
    status = '',
    minPrice = '0',
    maxPrice = `${Number.MAX_SAFE_INTEGER}`,
    minArea = '0',
    maxArea = `${Number.MAX_SAFE_INTEGER}`,
    page,
    limit,
    visibility,
  } = req.query

  const hasQuery =
    q || location || type || status || visibility || page || limit || minPrice !== '0' ||
    maxPrice !== `${Number.MAX_SAFE_INTEGER}` || minArea !== '0' ||
    maxArea !== `${Number.MAX_SAFE_INTEGER}`

  let filtered = list.filter((p) => {
    const keywordMatch =
      !q ||
      p.title?.toLowerCase().includes(String(q).toLowerCase()) ||
      p.description?.toLowerCase().includes(String(q).toLowerCase())
    const locationMatch = !location || p.location?.toLowerCase().includes(String(location).toLowerCase())
    const typeMatch = !type || p.type === type
    const statusMatch = !status || p.status === status
    const priceMatch = p.price >= Number(minPrice) && p.price <= Number(maxPrice)
    const areaMatch = p.area >= Number(minArea) && p.area <= Number(maxArea)
    const visibilityMatch = !visibility || (p.visibility ?? 'approved') === visibility
    return keywordMatch && locationMatch && typeMatch && statusMatch && priceMatch && areaMatch && visibilityMatch
  })

  // If no query, keep legacy behavior (array response)
  if (!hasQuery) {
    return res.json(filtered)
  }

  const pageNum = Math.max(1, Number(page) || 1)
  const limitNum = Math.max(1, Math.min(100, Number(limit) || 9))
  const start = (pageNum - 1) * limitNum
  const items = filtered.slice(start, start + limitNum)

  res.json({ items, total: filtered.length, page: pageNum, limit: limitNum })
})

app.get('/api/properties/:id', async (req, res) => {
  const db = await readDb()
  const id = Number(req.params.id)
  const item = (db.properties ?? []).find((p) => p.id === id)
  if (!item) return res.status(404).json({ message: 'Không tìm thấy tin' })
  res.json(item)
})

app.post('/api/properties', async (req, res) => {
  const body = req.body || {}
  const requiredFields = ['title', 'price', 'location', 'type', 'status']
  const missing = requiredFields.filter((field) => !body[field])
  if (missing.length) {
    return res.status(400).json({ message: `Thiếu trường: ${missing.join(', ')}` })
  }

  const db = await readDb()
  const newProperty = {
    id: Date.now(),
    title: body.title,
    price: Number(body.price) || 0,
    location: body.location,
    type: body.type,
    status: body.status,
    beds: Number(body.beds) || 0,
    baths: Number(body.baths) || 0,
    area: Number(body.area) || 0,
    image:
      body.image ||
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80&sat=-30',
    description:
      body.description ||
      'Tin đăng do bạn tạo. Vui lòng cập nhật mô tả chi tiết để thu hút khách hàng.',
    tags: Array.isArray(body.tags) && body.tags.length ? body.tags : ['Tin mới', 'Chủ nhà đăng'],
    contactName: body.contactName || 'Chủ nhà',
    contactPhone: body.contactPhone || 'Đang cập nhật',
    postedAt: 'Vừa xong',
    ownerEmail: body.ownerEmail || 'anonymous@example.com',
    ownerName: body.ownerName || body.contactName || 'Chủ nhà',
    visibility: body.visibility || 'pending', // pending | approved | hidden
  }

  db.properties = [newProperty, ...(db.properties ?? [])]
  await writeDb(db)
  res.status(201).json(newProperty)
})

app.patch('/api/properties/:id', async (req, res) => {
  const db = await readDb()
  const id = Number(req.params.id)
  const idx = (db.properties ?? []).findIndex((p) => p.id === id)
  if (idx === -1) return res.status(404).json({ message: 'Không tìm thấy tin' })
  const current = db.properties[idx]
  const updated = { ...current, ...req.body, id: current.id }
  db.properties[idx] = updated
  await writeDb(db)
  res.json(updated)
})

app.delete('/api/properties/:id', async (req, res) => {
  const db = await readDb()
  const id = Number(req.params.id)
  const before = db.properties?.length || 0
  db.properties = (db.properties ?? []).filter((p) => p.id !== id)
  if ((db.properties?.length || 0) === before) return res.status(404).json({ message: 'Không tìm thấy tin' })
  await writeDb(db)
  res.status(204).end()
})

app.patch('/api/properties/:id/moderation', async (req, res) => {
  const { visibility = 'approved' } = req.body || {}
  const allowed = ['approved', 'hidden', 'pending']
  if (!allowed.includes(visibility)) return res.status(400).json({ message: 'Trạng thái không hợp lệ' })
  const db = await readDb()
  const id = Number(req.params.id)
  const idx = (db.properties ?? []).findIndex((p) => p.id === id)
  if (idx === -1) return res.status(404).json({ message: 'Không tìm thấy tin' })
  db.properties[idx].visibility = visibility
  await writeDb(db)
  res.json(db.properties[idx])
})

app.get('/api/stats/by-location', async (_req, res) => {
  const db = await readDb()
  const stats = Object.values(
    (db.properties ?? []).reduce((acc, p) => {
      const key = p.location || 'Khác'
      if (!acc[key]) acc[key] = { location: key, count: 0 }
      if ((p.visibility ?? 'approved') === 'approved') acc[key].count += 1
      return acc
    }, {})
  )
  res.json(stats)
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

ensureDb().then(() => {
  app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`)
  })
})
