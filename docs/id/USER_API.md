# Dokumentasi API Pengguna

## URL Dasar
```
/api/users
```

## Autentikasi

Sebagian besar endpoint user memerlukan autentikasi. Sertakan token JWT di header Authorization:
```
Authorization: Bearer <token-anda-disini>
```

---

## Endpoint

### 1. Ambil Semua Pengguna

Mengambil daftar semua pengguna (endpoint publik, tidak memerlukan autentikasi).

**Endpoint:** `GET /api/users`

**Autentikasi:** Tidak diperlukan

**Respon Sukses (200 OK):**
```json
{
  "meta": {
    "status": "success",
    "code": 200,
    "message": "Users fetched successfully."
  },
  "data": [
    {
      "id": "uuid-string",
      "email": "john.doe@example.com",
      "username": "John Doe",
      "image": "https://example.com/avatar.jpg"
    },
    {
      "id": "uuid-string-2",
      "email": "jane.smith@example.com",
      "username": "Jane Smith",
      "image": null
    }
  ]
}
```

**Catatan:**
- Field password tidak pernah disertakan dalam respon
- Ini adalah endpoint publik dan tidak memerlukan autentikasi

---

### 2. Ambil Profil Pengguna Saat Ini

Mengambil profil pengguna yang sedang login.

**Endpoint:** `GET /api/users/profile`

**Autentikasi:** Diperlukan (Token JWT)

**Header:**
```
Authorization: Bearer <token-anda-disini>
```

**Respon Sukses (200 OK):**
```json
{
  "meta": {
    "status": "success",
    "code": 200,
    "message": "User profile fetched successfully."
  },
  "data": {
    "id": "uuid-string",
    "email": "john.doe@example.com",
    "username": "John Doe",
    "image": "https://example.com/avatar.jpg"
  }
}
```

**Respon Error:**

**401 Unauthorized** - Token Hilang atau Tidak Valid:
```json
{
  "meta": {
    "status": "error",
    "code": 401,
    "message": "Unauthorized"
  }
}
```

---

### 3. Ambil Pengguna berdasarkan ID

Mengambil data pengguna spesifik berdasarkan ID mereka.

**Endpoint:** `GET /api/users/:id`

**Autentikasi:** Diperlukan (Token JWT)

**Parameter URL:**
| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| id | string (UUID) | Ya | ID Pengguna |

**Header:**
```
Authorization: Bearer <token-anda-disini>
```

**Respon Sukses (200 OK):**
```json
{
  "meta": {
    "status": "success",
    "code": 200,
    "message": "User fetched successfully."
  },
  "data": {
    "id": "uuid-string",
    "email": "john.doe@example.com",
    "username": "John Doe",
    "image": "https://example.com/avatar.jpg"
  }
}
```

**Respon Error:**

**401 Unauthorized** - Token Hilang atau Tidak Valid:
```json
{
  "meta": {
    "status": "error",
    "code": 401,
    "message": "Unauthorized"
  }
}
```

**404 Not Found** - Pengguna Tidak Ditemukan:
```json
{
  "meta": {
    "status": "error",
    "code": 404,
    "message": "User not found"
  }
}
```

---

### 4. Perbarui Pengguna

Memperbarui informasi pengguna.

**Endpoint:** `PUT /api/users/:id`

**Autentikasi:** Diperlukan (Token JWT)

**Parameter URL:**
| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|-------|-----------|
| id | string (UUID) | Ya | ID Pengguna |

**Header:**
```
Authorization: Bearer <token-anda-disini>
```

**Body Request:**
Semua field bersifat opsional. Hanya sertakan field yang ingin Anda perbarui.

```json
{
  "email": "newemail@example.com",
  "username": "New Username",
  "password": "newSecurePassword123",
  "image": "https://example.com/new-avatar.jpg"
}
```

**Detail Field:**
| Field | Tipe | Wajib | Deskripsi |
|-------|------|-------|-----------|
| email | string | Tidak | Alamat email yang valid |
| username | string | Tidak | Nama pengguna (min 3, maks 50 karakter) |
| password | string | Tidak | Kata sandi baru (min 6, maks 50 karakter) |
| image | string | Tidak | URL gambar profil |

**Aturan Validasi:**
- `email`: Harus format email yang valid jika disertakan
- `username`: Min 3 karakter, maks 50 karakter jika disertakan
- `password`: Min 6 karakter, maks 50 karakter jika disertakan
- Kata sandi akan otomatis di-hash jika diperbarui

**Respon Sukses (200 OK):**
```json
{
  "meta": {
    "status": "success",
    "code": 200,
    "message": "User updated successfully."
  },
  "data": {
    "id": "uuid-string",
    "email": "newemail@example.com",
    "username": "New Username",
    "image": "https://example.com/new-avatar.jpg"
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

**401 Unauthorized** - Token Hilang atau Tidak Valid:
```json
{
  "meta": {
    "status": "error",
    "code": 401,
    "message": "Unauthorized"
  }
}
```

**404 Not Found** - Pengguna Tidak Ditemukan:
```json
{
  "meta": {
    "status": "error",
    "code": 404,
    "message": "User not found"
  }
}
```

---

## Contoh

### Contoh cURL

**Ambil semua pengguna:**
```bash
curl -X GET http://localhost:3000/api/users
```

**Ambil profil pengguna saat ini:**
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Ambil pengguna berdasarkan ID:**
```bash
curl -X GET http://localhost:3000/api/users/uuid-here \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Perbarui pengguna:**
```bash
curl -X PUT http://localhost:3000/api/users/uuid-here \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Updated Username",
    "image": "https://example.com/new-avatar.jpg"
  }'
```

**Perbarui kata sandi:**
```bash
curl -X PUT http://localhost:3000/api/users/uuid-here \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newSecurePassword123"
  }'
```

---

## Catatan

- **Autentikasi Diperlukan**: Semua endpoint kecuali `GET /api/users` memerlukan token JWT yang valid
- **Format Token**: Sertakan token di header Authorization sebagai `Bearer <token>`
- **Keamanan Kata Sandi**: Kata sandi secara otomatis di-hash menggunakan bcrypt ketika diperbarui
- **Kata Sandi Tidak Dikembalikan**: Kata sandi pengguna tidak pernah disertakan dalam respon API
- **Pembaruan Parsial**: Endpoint update mendukung pembaruan parsial - hanya kirimkan field yang ingin Anda ubah
- **Gambar Profil**: Field `image` dapat menyimpan URL ke gambar profil pengguna
