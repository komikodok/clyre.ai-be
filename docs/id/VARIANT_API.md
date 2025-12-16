# Dokumentasi API Varian

## URL Dasar
```
/api/variants
```

## Endpoint

### 1. Ambil Semua Varian

Mengambil daftar semua varian produk dengan filter pencarian opsional.

**Endpoint:** `GET /api/variants`

**Parameter Query:**
| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| search | string | Tidak | Filter varian berdasarkan nama (case-insensitive) |

**Respon Sukses (200 OK):**
```json
{
  "meta": {
    "status": "success",
    "code": 200,
    "message": "Variants fetched successfully."
  },
  "data": [
    {
      "id": "uuid-string",
      "name": "large",
      "stock": 20,
      "productId": "product-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "uuid-string-2",
      "name": "medium",
      "stock": 15,
      "productId": "product-uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Contoh Request:**
```bash
# Ambil semua varian
GET /api/variants

# Cari varian
GET /api/variants?search=large
```

---

### 2. Buat Varian

Membuat varian produk baru.

**Endpoint:** `POST /api/variants`

**Body Request:**
```json
{
  "name": "Large",
  "stock": 20,
  "productId": "product-uuid"
}
```

**Detail Field:**
| Field | Tipe | Wajib | Deskripsi |
|-------|------|-------|-----------|
| name | string | Ya | Nama varian (min 3, maks 50 karakter) |
| stock | number | Ya | Stok tersedia (harus >= 0) |
| productId | string (UUID) | Ya | ID Produk (maks 38 karakter) |

**Aturan Validasi:**
- `name`: Wajib, string, min 3 karakter, maks 50 karakter
- `stock`: Wajib, number, harus >= 0
- `productId`: Wajib, string, maks 38 karakter
- Nama akan otomatis dikonversi menjadi huruf kecil
- Nama varian harus unik

**Respon Sukses (201 Created):**
```json
{
  "meta": {
    "status": "success",
    "code": 201,
    "message": "Variant created successfully."
  },
  "data": {
    "id": "uuid-string",
    "name": "large",
    "stock": 20,
    "productId": "product-uuid",
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

Contoh error validasi:
- Nama terlalu pendek (kurang dari 3 karakter)
- Nama terlalu panjang (lebih dari 50 karakter)
- Stok negatif
- Field wajib tidak diisi

**409 Conflict** - Varian Sudah Ada:
```json
{
  "meta": {
    "status": "error",
    "code": 409,
    "message": "Variant already exists"
  }
}
```

---

### 3. Hapus Varian

Menghapus varian berdasarkan ID.

**Endpoint:** `DELETE /api/variants/:id`

**Parameter URL:**
| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| id | string (UUID) | Ya | ID Varian |

**Respon Sukses (200 OK):**
```json
{
  "meta": {
    "status": "success",
    "code": 200,
    "message": "Variant deleted successfully."
  },
  "data": null
}
```

**Respon Error:**

**404 Not Found** - Varian Tidak Ditemukan:
```json
{
  "meta": {
    "status": "error",
    "code": 404,
    "message": "Variant is not found"
  }
}
```

---

## Contoh

### Contoh cURL

**Ambil semua varian:**
```bash
curl -X GET http://localhost:3000/api/variants
```

**Cari varian:**
```bash
curl -X GET "http://localhost:3000/api/variants?search=large"
```

**Buat varian:**
```bash
curl -X POST http://localhost:3000/api/variants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Large",
    "stock": 20,
    "productId": "product-uuid-here"
  }'
```

**Hapus varian:**
```bash
curl -X DELETE http://localhost:3000/api/variants/uuid-here
```

---

## Kasus Penggunaan

### Tipe Varian Umum

Varian biasanya digunakan untuk variasi produk seperti:

**Varian Ukuran:**
```json
{ "name": "Small", "stock": 10, "productId": "..." }
{ "name": "Medium", "stock": 15, "productId": "..." }
{ "name": "Large", "stock": 20, "productId": "..." }
{ "name": "XL", "stock": 8, "productId": "..." }
```

**Varian Warna:**
```json
{ "name": "Red", "stock": 12, "productId": "..." }
{ "name": "Blue", "stock": 18, "productId": "..." }
{ "name": "Black", "stock": 25, "productId": "..." }
```

**Varian Spesifikasi:**
```json
{ "name": "8GB RAM", "stock": 10, "productId": "..." }
{ "name": "16GB RAM", "stock": 15, "productId": "..." }
{ "name": "32GB RAM", "stock": 5, "productId": "..." }
```

---

## Catatan

- **Konversi Huruf Kecil**: Semua nama varian otomatis dikonversi menjadi huruf kecil demi konsistensi
- **Keunikan**: Nama varian harus unik di seluruh sistem (bukan hanya per produk)
- **Manajemen Stok**: Setiap varian memiliki jumlah stok sendiri yang independen dari produk induk
- **Tidak Ada Endpoint Update**: Saat ini, tidak ada endpoint pembaruan untuk varian. Untuk memodifikasi varian, hapus dan buat ulang
- **Asosiasi Produk**: Varian harus dikaitkan dengan produk yang ada melalui `productId`
