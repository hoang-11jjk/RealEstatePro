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

app.get('/api/properties', async (_req, res) => {
  const db = await readDb()
  res.json(db.properties ?? [])
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
  }

  db.properties = [newProperty, ...(db.properties ?? [])]
  await writeDb(db)
  res.status(201).json(newProperty)
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

ensureDb().then(() => {
  app.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`)
  })
})
