# Dokumentasi API

Direktori ini berisi dokumentasi API lengkap untuk layanan backend Clyre.ai.

## Dokumentasi Tersedia

### 🔐 [API Autentikasi](./AUTH_API.md)
Dokumentasi untuk endpoint autentikasi pengguna.

**Endpoint:**
- `POST /api/auth/register` - Registrasi pengguna baru
- `POST /api/auth/login` - Login dan terima token JWT

---

### 👤 [API Pengguna](./USER_API.md)
Dokumentasi untuk endpoint manajemen pengguna.

**Endpoint:**
- `GET /api/users` - Ambil semua pengguna (publik)
- `GET /api/users/profile` - Ambil profil pengguna saat ini (terautentikasi)
- `GET /api/users/:id` - Ambil pengguna berdasarkan ID (terautentikasi)
- `PUT /api/users/:id` - Perbarui pengguna (terautentikasi)

---

### 📁 [API Kategori](./CATEGORY_API.md)
Dokumentasi untuk endpoint manajemen kategori.

**Endpoint:**
- `GET /api/categories` - Ambil semua kategori dengan pencarian
- `POST /api/categories` - Buat kategori baru
- `DELETE /api/categories/:id` - Hapus kategori

---

### 📦 [API Produk](./PRODUCT_API.md)
Dokumentasi untuk endpoint manajemen produk.

**Endpoint:**
- `GET /api/products` - Ambil semua produk dengan paginasi, pencarian, dan pengurutan
- `GET /api/products/:id` - Ambil satu produk berdasarkan ID
- `POST /api/products` - Buat produk baru
- `PATCH /api/products/:id` - Perbarui produk
- `DELETE /api/products/:id` - Hapus produk

---

### 🎨 [API Varian](./VARIANT_API.md)
Dokumentasi untuk endpoint manajemen varian produk.

**Endpoint:**
- `GET /api/variants` - Ambil semua varian dengan pencarian
- `POST /api/variants` - Buat varian baru
- `DELETE /api/variants/:id` - Hapus varian

---

## Mulai Cepat

Semua endpoint API mengikuti format respon yang konsisten:

**Respon Sukses:**
```json
{
  "meta": {
    "status": "success",
    "code": 200,
    "message": "Pesan sukses operasi"
  },
  "data": { ... }
}
```

**Respon Error:**
```json
{
  "meta": {
    "status": "error",
    "code": 400,
    "message": "Pesan error"
  }
}
```

## Kode Status HTTP Umum

| Kode | Deskripsi |
|------|-----------|
| 200 | OK - Request berhasil |
| 201 | Created - Resource berhasil dibuat |
| 400 | Bad Request - Error validasi atau input tidak valid |
| 404 | Not Found - Resource tidak ditemukan |
| 409 | Conflict - Resource sudah ada |
| 500 | Internal Server Error - Error server |

## Pengujian

Semua endpoint memiliki tes integrasi komprehensif yang terletak di direktori `/tests`:

- `tests/category.test.ts` - Tes API Kategori
- `tests/product.test.ts` - Tes API Produk
- `tests/variant.test.ts` - Tes API Varian

Jalankan tes dengan:
```bash
npm test
```

## Sumber Daya Tambahan

- [README Utama](../../README.md) - Gambaran proyek dan instruksi setup
- [Schema Prisma](../../prisma/schema.prisma) - Definisi skema database
