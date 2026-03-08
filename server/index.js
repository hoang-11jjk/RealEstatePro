import "dotenv/config";
import express from "express";
import cors from "cors";
import pool from "./db.js";

// --- JSON fallback (kept for backup) ---
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, "db.json");

async function readDb() {
  try {
    const raw = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(raw || "{}");
  } catch {
    return { properties: [] };
  }
}

async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}

async function ensureDb() {
  const db = await readDb();
  if (!db.properties || !Array.isArray(db.properties)) {
    db.properties = [];
  }
  if (!db.users || !Array.isArray(db.users)) {
    db.users = [];
  }
  await writeDb(db);
}
// --- End JSON fallback ---

const PORT = process.env.PORT || 4000;

function parseProperty(row) {
  return {
    ...row,
    tags: typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags || [],
  };
}

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/properties", async (req, res) => {
  const {
    q = "",
    location = "",
    type = "",
    status = "",
    minPrice = "0",
    maxPrice = `${Number.MAX_SAFE_INTEGER}`,
    minArea = "0",
    maxArea = `${Number.MAX_SAFE_INTEGER}`,
    page,
    limit,
    visibility,
  } = req.query;

  const hasQuery =
    q ||
    location ||
    type ||
    status ||
    visibility ||
    page ||
    limit ||
    minPrice !== "0" ||
    maxPrice !== `${Number.MAX_SAFE_INTEGER}` ||
    minArea !== "0" ||
    maxArea !== `${Number.MAX_SAFE_INTEGER}`;

  let sql = "SELECT * FROM properties WHERE 1=1";
  const params = [];

  if (q) {
    sql += " AND (title LIKE ? OR description LIKE ?)";
    params.push(`%${q}%`, `%${q}%`);
  }
  if (location) {
    sql += " AND location LIKE ?";
    params.push(`%${location}%`);
  }
  if (type) {
    sql += " AND type = ?";
    params.push(type);
  }
  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }
  if (minPrice !== "0") {
    sql += " AND price >= ?";
    params.push(Number(minPrice));
  }
  if (maxPrice !== `${Number.MAX_SAFE_INTEGER}`) {
    sql += " AND price <= ?";
    params.push(Number(maxPrice));
  }
  if (minArea !== "0") {
    sql += " AND area >= ?";
    params.push(Number(minArea));
  }
  if (maxArea !== `${Number.MAX_SAFE_INTEGER}`) {
    sql += " AND area <= ?";
    params.push(Number(maxArea));
  }
  if (visibility) {
    sql += ' AND COALESCE(visibility, "approved") = ?';
    params.push(visibility);
  }

  if (!hasQuery) {
    const [rows] = await pool.query(sql + " ORDER BY id DESC", params);
    return res.json(rows.map(parseProperty));
  }

  // Get total count for pagination
  const countSql = sql.replace("SELECT *", "SELECT COUNT(*) as total");
  const [countRows] = await pool.query(countSql, params);
  const total = countRows[0].total;

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.max(1, Math.min(100, Number(limit) || 9));
  const offset = (pageNum - 1) * limitNum;

  sql += " ORDER BY id DESC LIMIT ? OFFSET ?";
  params.push(limitNum, offset);

  const [rows] = await pool.query(sql, params);
  res.json({
    items: rows.map(parseProperty),
    total,
    page: pageNum,
    limit: limitNum,
  });
});

app.get("/api/properties/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [rows] = await pool.query("SELECT * FROM properties WHERE id = ?", [
    id,
  ]);
  if (rows.length === 0)
    return res.status(404).json({ message: "Không tìm thấy tin" });
  res.json(parseProperty(rows[0]));
});

app.post("/api/properties", async (req, res) => {
  const body = req.body || {};
  const requiredFields = ["title", "price", "location", "type", "status"];
  const missing = requiredFields.filter((field) => !body[field]);
  if (missing.length) {
    return res
      .status(400)
      .json({ message: `Thiếu trường: ${missing.join(", ")}` });
  }

  const newProperty = {
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
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80&sat=-30",
    description:
      body.description ||
      "Tin đăng do bạn tạo. Vui lòng cập nhật mô tả chi tiết để thu hút khách hàng.",
    tags: JSON.stringify(
      Array.isArray(body.tags) && body.tags.length
        ? body.tags
        : ["Tin mới", "Chủ nhà đăng"],
    ),
    contactName: body.contactName || "Chủ nhà",
    contactPhone: body.contactPhone || "Đang cập nhật",
    postedAt: "Vừa xong",
    ownerEmail: body.ownerEmail || "anonymous@example.com",
    ownerName: body.ownerName || body.contactName || "Chủ nhà",
    visibility: body.visibility || "pending",
  };

  const columns = Object.keys(newProperty);
  const placeholders = columns.map(() => "?").join(", ");
  const values = columns.map((col) => newProperty[col]);

  const [result] = await pool.query(
    `INSERT INTO properties (${columns.join(", ")}) VALUES (${placeholders})`,
    values,
  );

  const [rows] = await pool.query("SELECT * FROM properties WHERE id = ?", [
    result.insertId,
  ]);
  res.status(201).json(parseProperty(rows[0]));
});

app.patch("/api/properties/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [existing] = await pool.query("SELECT * FROM properties WHERE id = ?", [
    id,
  ]);
  if (existing.length === 0)
    return res.status(404).json({ message: "Không tìm thấy tin" });

  const body = { ...req.body };
  // Don't allow overwriting id
  delete body.id;
  // Serialize tags if present
  if (body.tags && Array.isArray(body.tags)) {
    body.tags = JSON.stringify(body.tags);
  }

  if (Object.keys(body).length === 0) {
    return res.json(parseProperty(existing[0]));
  }

  const setClauses = Object.keys(body).map((key) => `${key} = ?`);
  const values = Object.values(body);

  await pool.query(
    `UPDATE properties SET ${setClauses.join(", ")} WHERE id = ?`,
    [...values, id],
  );

  const [rows] = await pool.query("SELECT * FROM properties WHERE id = ?", [
    id,
  ]);
  res.json(parseProperty(rows[0]));
});

app.delete("/api/properties/:id", async (req, res) => {
  const id = Number(req.params.id);
  const [result] = await pool.query("DELETE FROM properties WHERE id = ?", [
    id,
  ]);
  if (result.affectedRows === 0)
    return res.status(404).json({ message: "Không tìm thấy tin" });
  res.status(204).end();
});

app.patch("/api/properties/:id/moderation", async (req, res) => {
  const { visibility = "approved" } = req.body || {};
  const allowed = ["approved", "hidden", "pending"];
  if (!allowed.includes(visibility))
    return res.status(400).json({ message: "Trạng thái không hợp lệ" });

  const id = Number(req.params.id);
  const [existing] = await pool.query("SELECT * FROM properties WHERE id = ?", [
    id,
  ]);
  if (existing.length === 0)
    return res.status(404).json({ message: "Không tìm thấy tin" });

  await pool.query("UPDATE properties SET visibility = ? WHERE id = ?", [
    visibility,
    id,
  ]);

  const [rows] = await pool.query("SELECT * FROM properties WHERE id = ?", [
    id,
  ]);
  res.json(parseProperty(rows[0]));
});

app.get("/api/stats/by-location", async (_req, res) => {
  const [rows] = await pool.query(
    `SELECT location, COUNT(*) as count FROM properties
     WHERE COALESCE(visibility, 'approved') = 'approved'
     GROUP BY location`,
  );
  res.json(rows);
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Authentication Endpoints
app.post("/auth/register", async (req, res) => {
  const { fullName, email, password, phone } = req.body || {};

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
  }

  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [
    email,
  ]);
  if (existing.length > 0) {
    return res.status(400).json({ message: "Email này đã được đăng ký" });
  }

  const [result] = await pool.query(
    "INSERT INTO users (fullName, email, password, phone, role) VALUES (?, ?, ?, ?, ?)",
    [fullName, email, password, phone || null, "user"],
  );

  const [rows] = await pool.query(
    "SELECT id, fullName, email, phone, role, createdAt FROM users WHERE id = ?",
    [result.insertId],
  );
  res.status(201).json(rows[0]);
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });
  }

  const [rows] = await pool.query(
    "SELECT id, fullName, email, phone, role, createdAt FROM users WHERE email = ? AND password = ?",
    [email, password],
  );

  if (rows.length === 0) {
    return res
      .status(401)
      .json({ message: "Email hoặc mật khẩu không chính xác" });
  }

  res.json(rows[0]);
});

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
