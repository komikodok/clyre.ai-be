# Dokumentasi API Autentikasi

## URL Dasar
```
/api/auth
```

## Endpoint

### 1. Registrasi Pengguna

Membuat akun user baru.

**Endpoint:** `POST /api/auth/register`

**Body Request:**
```json
{
  "email": "john.doe@example.com",
  "username": "John Doe",
  "password": "securePassword123"
}
```

**Detail Field:**
| Field | Tipe | Wajib | Deskripsi |
|-------|------|-------|-----------|
| email | string | Ya | Alamat email yang valid |
| username | string | Ya | Nama user (min 3, maks 50 karakter) |
| password | string | Ya | Kata sandi (min 6, maks 50 karakter) |

**Aturan Validasi:**
- `email`: Harus format email yang valid
- `username`: Wajib, min 3 karakter, maks 50 karakter
- `password`: Wajib, min 6 karakter, maks 50 karakter
- Kata sandi akan otomatis di-hash menggunakan bcrypt

**Respon Sukses (201 Created):**
```json
{
  "meta": {
    "status": "success",
    "code": 201,
    "message": "User registered successfully."
  },
  "data": null
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
- Format email tidak valid
- Username terlalu pendek (kurang dari 3 karakter)
- Username terlalu panjang (lebih dari 50 karakter)
- Password terlalu pendek (kurang dari 6 karakter)
- Password terlalu panjang (lebih dari 50 karakter)
- Field wajib tidak diisi

**409 Conflict** - Pengguna Sudah Ada:
```json
{
  "meta": {
    "status": "error",
    "code": 409,
    "message": "User already exists"
  }
}
```

---

### 2. Login Pengguna

Autentikasi user dan menerima token akses.

**Endpoint:** `POST /api/auth/login`

**Body Request:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Detail Field:**
| Field | Tipe | Wajib | Deskripsi |
|-------|------|-------|-----------|
| email | string | Ya | Alamat email yang valid |
| password | string | Ya | Kata sandi user (min 6, maks 50 karakter) |

**Aturan Validasi:**
- `email`: Harus format email yang valid
- `password`: Wajib, min 6 karakter, maks 50 karakter

**Respon Sukses (200 OK):**
```json
{
  "meta": {
    "status": "success",
    "code": 200,
    "message": "Login successful."
  },
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
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

**401 Unauthorized** - Kredensial Tidak Valid:
```json
{
  "meta": {
    "status": "error",
    "code": 401,
    "message": "Invalid email or password"
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

**Registrasi user baru:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "username": "John Doe",
    "password": "securePassword123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securePassword123"
  }'
```

**Menggunakan token pada request selanjutnya:**
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Alur Autentikasi

1. **Registrasi**: Buat akun baru menggunakan `/api/auth/register`
2. **Login**: Autentikasi dan dapatkan token JWT menggunakan `/api/auth/login`
3. **Gunakan Token**: Sertakan token di header `Authorization` untuk rute yang dilindungi:
   ```
   Authorization: Bearer <token-anda-disini>
   ```

---

## Catatan

- **Keamanan Kata Sandi**: Semua kata sandi di-hash menggunakan bcrypt dengan salt round 10 sebelum disimpan di database
- **Token JWT**: Endpoint login mengembalikan JWT (JSON Web Token) yang harus digunakan untuk mengautentikasi request selanjutnya
- **Format Token**: Sertakan token di header Authorization sebagai `Bearer <token>`
- **Keunikan Email**: Alamat email harus unik untuk setiap user
- **Kata Sandi Tidak Ditampilkan**: Kata sandi user tidak pernah dikembalikan dalam respon API demi keamanan
