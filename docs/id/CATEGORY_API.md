# Dokumentasi API Kategori

## URL Dasar
```
/api/categories
```

## Endpoint

### 1. Ambil Semua Kategori

Mengambil daftar semua kategori dengan filter pencarian opsional.

**Endpoint:** `GET /api/categories`

**Parameter Query:**
| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| search | string | Tidak | Filter kategori berdasarkan nama (case-insensitive) |

**Respon Sukses (200 OK):**
```json
{
  "meta": {
    "status": "success",
    "code": 200,
    "message": "Categories fetched successfully."
  },
  "data": [
    {
      "id": "uuid-string",
      "name": "electronics",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Contoh Request:**
```bash
# Ambil semua kategori
GET /api/categories

# Cari kategori
GET /api/categories?search=electronics
```

---

### 2. Buat Kategori

Membuat kategori baru.

**Endpoint:** `POST /api/categories`

**Body Request:**
```json
{
  "name": "electronics"
}
```

**Aturan Validasi:**
- `name`: Wajib, string, min 3 karakter, maks 50 karakter
- Nama akan otomatis dikonversi menjadi huruf kecil

**Respon Sukses (201 Created):**
```json
{
  "meta": {
    "status": "success",
    "code": 201,
    "message": "Category created successfully."
  },
  "data": {
    "id": "uuid-string",
    "name": "electronics",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Respon Error:**

**400 Bad Request** - Error Validasi:
```json
{
  "meta": {
    "status": "error",
    "code": 400,
    "message": "Pesan error validasi"
  }
}
```

**409 Conflict** - Kategori Sudah Ada:
```json
{
  "meta": {
    "status": "error",
    "code": 409,
    "message": "Category already exists"
  }
}
```

---

### 3. Hapus Kategori

Menghapus kategori berdasarkan ID.

**Endpoint:** `DELETE /api/categories/:id`

**Parameter URL:**
| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| id | string (UUID) | Ya | ID Kategori |

**Respon Sukses (200 OK):**
```json
{
  "meta": {
    "status": "success",
    "code": 200,
    "message": "Category deleted successfully."
  }
}
```

**Respon Error:**

**404 Not Found** - Kategori Tidak Ditemukan:
```json
{
  "meta": {
    "status": "error",
    "code": 404,
    "message": "Category is not found"
  }
}
```

---

## Contoh

### Contoh cURL

**Ambil semua kategori:**
```bash
curl -X GET http://localhost:3000/api/categories
```

**Cari kategori:**
```bash
curl -X GET "http://localhost:3000/api/categories?search=electronics"
```

**Buat kategori:**
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "electronics"}'
```

**Hapus kategori:**
```bash
curl -X DELETE http://localhost:3000/api/categories/uuid-here
```

---

## Catatan

- Semua nama kategori otomatis dikonversi menjadi huruf kecil
- Nama kategori harus unik
- Penghapusan kategori mungkin gagal jika ada produk yang terkait dengannya (tergantung pada batasan database)
