# Authentication API Documentation

## Base URL
```
/api/auth
```

## Endpoints

### 1. Register User

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "username": "John Doe",
  "password": "securePassword123"
}
```

**Field Details:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Valid email address |
| username | string | Yes | Username (min 3, max 50 characters) |
| password | string | Yes | Password (min 6, max 50 characters) |

**Validation Rules:**
- `email`: Must be a valid email format
- `username`: Required, min 3 characters, max 50 characters
- `password`: Required, min 6 characters, max 50 characters
- Password will be automatically hashed using bcrypt

**Success Response (201 Created):**
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

**Error Responses:**

**400 Bad Request** - Validation Error:
```json
{
  "meta": {
    "status": "error",
    "code": 400,
    "message": "Validation error message"
  }
}
```

Examples of validation errors:
- Invalid email format
- Username too short (less than 3 characters)
- Username too long (more than 50 characters)
- Password too short (less than 6 characters)
- Password too long (more than 50 characters)
- Missing required fields

**409 Conflict** - User Already Exists:
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

### 2. Login User

Authenticate a user and receive an access token.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Field Details:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Valid email address |
| password | string | Yes | User password (min 6, max 50 characters) |

**Validation Rules:**
- `email`: Must be a valid email format
- `password`: Required, min 6 characters, max 50 characters

**Success Response (200 OK):**
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

**Error Responses:**

**400 Bad Request** - Validation Error:
```json
{
  "meta": {
    "status": "error",
    "code": 400,
    "message": "Validation error message"
  }
}
```

**401 Unauthorized** - Invalid Credentials:
```json
{
  "meta": {
    "status": "error",
    "code": 401,
    "message": "Invalid email or password"
  }
}
```

**404 Not Found** - User Not Found:
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

## Examples

### cURL Examples

**Register a new user:**
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

**Using the token in subsequent requests:**
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

---

## Authentication Flow

1. **Register**: Create a new account using `/api/auth/register`
2. **Login**: Authenticate and receive a JWT token using `/api/auth/login`
3. **Use Token**: Include the token in the `Authorization` header for protected routes:
   ```
   Authorization: Bearer <your-token-here>
   ```

---

## Notes

- **Password Security**: All passwords are hashed using bcrypt with a salt round of 10 before being stored in the database
- **JWT Token**: The login endpoint returns a JWT (JSON Web Token) that should be used for authenticating subsequent requests
- **Token Format**: Include the token in the Authorization header as `Bearer <token>`
- **Email Uniqueness**: Email addresses must be unique across all users
- **No Password in Response**: User passwords are never returned in API responses for security
