# Dokumentasi API Produk

## URL Dasar
```
/api/products
```

## Endpoint

### 1. Ambil Semua Produk

Mengambil daftar semua produk dengan kemampuan paginasi, pencarian, dan pengurutan.

**Endpoint:** `GET /api/products`

**Parameter Query:**
| Parameter | Tipe | Wajib | Default | Deskripsi |
|-----------|------|-------|---------|-----------|
| page | number | Tidak | 1 | Nomor halaman untuk paginasi |
| limit | number | Tidak | 10 | Jumlah item per halaman |
| search | string | Tidak | - | Cari berdasarkan nama produk atau SKU |
| sort | string | Tidak | asc | Urutan sort: `asc` atau `desc` |

**Respon Sukses (200 OK):**
```json
{
  "meta": {
    "status": "success",
    "code": 200,
    "message": "Products fetched successfully."
  },
  "data": [
    {
      "id": "uuid-string",
      "sku": "SKU-001",
      "name": "Laptop Gaming",
      "slug": "laptop-gaming",
      "description": "High performance gaming laptop",
      "priceAmount": 15000000,
      "priceCurrency": "IDR",
      "stock": 10,
      "categoryId": "category-uuid",
      "category": {
        "id": "category-uuid",
        "name": "electronics"
      },
      "images": [],
      "variants": [],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "totalItems": 50,
  "totalPages": 5,
  "nextPage": 2,
  "prevPage": null,
  "limit": 10
}
```

**Contoh Request:**
```bash
# Ambil semua produk (paginasi default)
GET /api/products

# Ambil produk dengan paginasi kustom
GET /api/products?page=2&limit=20

# Cari produk
GET /api/products?search=laptop

# Urutkan produk secara menurun
GET /api/products?sort=desc

# Filter gabungan
GET /api/products?page=1&limit=5&search=gaming&sort=desc
```

---

### 2. Ambil Produk berdasarkan ID

Mengambil satu produk berdasarkan ID-nya.

**Endpoint:** `GET /api/products/:id`

**Parameter URL:**
| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| id | string (UUID) | Ya | ID Produk |

**Respon Sukses (200 OK):**
```json
{
  "meta": {
    "status": "success",
    "code": 200,
    "message": "Product fetched successfully."
  },
  "data": {
    "id": "uuid-string",
    "sku": "SKU-001",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming",
    "description": "High performance gaming laptop",
    "priceAmount": 15000000,
    "priceCurrency": "IDR",
    "stock": 10,
    "categoryId": "category-uuid",
    "category": {
      "id": "category-uuid",
      "name": "electronics"
    },
    "images": [
      {
        "id": "image-uuid",
        "url": "https://example.com/image.jpg",
        "order": 1
      }
    ],
    "variants": [
      {
        "id": "variant-uuid",
        "name": "16GB RAM",
        "stock": 5
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Respon Error:**

**404 Not Found** - Produk Tidak Ditemukan:
```json
{
  "meta": {
    "status": "error",
    "code": 404,
    "message": "Product not found"
  }
}
```

---

### 3. Buat Produk

Membuat produk baru.

**Endpoint:** `POST /api/products`

**Body Request:**
```json
{
  "sku": "SKU-001",
  "name": "Laptop Gaming",
  "slug": "laptop-gaming",
  "description": "High performance gaming laptop",
  "priceAmount": 15000000,
  "priceCurrency": "IDR",
  "stock": 10,
  "categoryId": "category-uuid"
}
```

**Detail Field:**
| Field | Tipe | Wajib | Deskripsi |
|-------|------|-------|-----------|
| name | string | Ya | Nama produk |
| priceAmount | number | Ya | Harga produk (harus positif) |
| categoryId | string (UUID) | Ya | ID Kategori (harus ada) |
| sku | string | Tidak | Stock Keeping Unit |
| slug | string | Tidak | Pengenal ramah URL (dibuat otomatis dari nama jika tidak disediakan) |
| description | string | Tidak | Deskripsi produk |
| priceCurrency | string | Tidak | Kode mata uang: `IDR` atau `USD` (default: `IDR`) |
| stock | number | Tidak | Stok tersedia (default: 0, harus >= 0) |

**Aturan Validasi:**
- `priceAmount` harus berupa angka positif
- `stock` harus >= 0
- `slug` harus unik (dibuat otomatis dari nama jika tidak disediakan)
- `categoryId` harus merujuk ke kategori yang ada

**Respon Sukses (201 Created):**
```json
{
  "meta": {
    "status": "success",
    "code": 201,
    "message": "Product created successfully."
  },
  "data": {
    "id": "uuid-string",
    "sku": "SKU-001",
    "name": "Laptop Gaming",
    "slug": "laptop-gaming",
    "description": "High performance gaming laptop",
    "priceAmount": 15000000,
    "priceCurrency": "IDR",
    "stock": 10,
    "categoryId": "category-uuid",
    "category": {
      "id": "category-uuid",
      "name": "electronics"
    },
    "images": [],
    "variants": [],
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

**404 Not Found** - Kategori Tidak Ditemukan:
```json
{
  "meta": {
    "status": "error",
    "code": 404,
    "message": "Category not found"
  }
}
```

**409 Conflict** - Slug Sudah Ada:
```json
{
  "meta": {
    "status": "error",
    "code": 409,
    "message": "Product with this slug already exists"
  }
}
```

---

### 4. Perbarui Produk

Memperbarui produk yang sudah ada.

**Endpoint:** `PATCH /api/products/:id`

**Parameter URL:**
| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| id | string (UUID) | Ya | ID Produk |

**Body Request:**
Semua field bersifat opsional. Hanya sertakan field yang ingin Anda perbarui.

```json
{
  "sku": "SKU-002",
  "name": "Updated Laptop Gaming",
  "slug": "updated-laptop-gaming",
  "description": "Updated description",
  "priceAmount": 16000000,
  "priceCurrency": "USD",
  "stock": 15,
  "categoryId": "new-category-uuid"
}
```

**Aturan Validasi:**
- Aturan validasi sama dengan pembuatan produk
- Jika `name` diperbarui tanpa `slug`, slug akan dibuat otomatis dari nama baru
- `slug` harus unik (tidak boleh konflik dengan produk lain)
- `categoryId` harus merujuk ke kategori yang ada jika disediakan

**Respon Sukses (200 OK):**
```json
{
  "meta": {
    "status": "success",
    "code": 200,
    "message": "Product updated successfully."
  },
  "data": {
    "id": "uuid-string",
    "sku": "SKU-002",
    "name": "Updated Laptop Gaming",
    "slug": "updated-laptop-gaming",
    "description": "Updated description",
    "priceAmount": 16000000,
    "priceCurrency": "USD",
    "stock": 15,
    "categoryId": "new-category-uuid",
    "category": {
      "id": "new-category-uuid",
      "name": "computers"
    },
    "images": [],
    "variants": [],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
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

**404 Not Found** - Produk atau Kategori Tidak Ditemukan:
```json
{
  "meta": {
    "status": "error",
    "code": 404,
    "message": "Product not found"
  }
}
```

**409 Conflict** - Slug Sudah Ada:
```json
{
  "meta": {
    "status": "error",
    "code": 409,
    "message": "Product with this slug already exists"
  }
}
```

---

### 5. Hapus Produk

Menghapus produk berdasarkan ID.

**Endpoint:** `DELETE /api/products/:id`

**Parameter URL:**
| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| id | string (UUID) | Ya | ID Produk |

**Respon Sukses (200 OK):**
```json
{
  "meta": {
    "status": "success",
    "code": 200,
    "message": "Product deleted successfully."
  },
  "data": null
}
```

**Respon Error:**

**404 Not Found** - Produk Tidak Ditemukan:
```json
{
  "meta": {
    "status": "error",
    "code": 404,
    "message": "Product not found"
  }
}
```

---

## Contoh

### Contoh cURL

**Ambil semua produk:**
```bash
curl -X GET http://localhost:3000/api/products
```

**Ambil produk dengan paginasi:**
```bash
curl -X GET "http://localhost:3000/api/products?page=1&limit=5"
```

**Cari produk:**
```bash
curl -X GET "http://localhost:3000/api/products?search=laptop"
```

**Ambil produk berdasarkan ID:**
```bash
curl -X GET http://localhost:3000/api/products/uuid-here
```

**Buat produk:**
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Gaming",
    "priceAmount": 15000000,
    "priceCurrency": "IDR",
    "stock": 10,
    "categoryId": "category-uuid"
  }'
```

**Perbarui produk:**
```bash
curl -X PATCH http://localhost:3000/api/products/uuid-here \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Laptop Gaming",
    "priceAmount": 16000000,
    "stock": 15
  }'
```

**Hapus produk:**
```bash
curl -X DELETE http://localhost:3000/api/products/uuid-here
```

---

## Catatan

- **Pembuatan Slug Otomatis**: Jika slug tidak disediakan saat pembuatan atau pembaruan (dengan perubahan nama), slug akan dibuat otomatis dari nama produk (huruf kecil, spasi diganti tanda hubung)
- **Paginasi**: Paginasi default adalah 10 item per halaman
- **Pencarian**: Mencari di kedua field nama produk dan SKU
- **Relasi**: Respon produk menyertakan data kategori, gambar, dan varian terkait
- **Mata Uang**: Mata uang yang didukung adalah IDR (Rupiah Indonesia) dan USD (Dolar AS)
