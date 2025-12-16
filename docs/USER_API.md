# User API Documentation

## Base URL
```
/api/users
```

## Authentication

Most user endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-token-here>
```

---

## Endpoints

### 1. Get All Users

Retrieve a list of all users (public endpoint, no authentication required).

**Endpoint:** `GET /api/users`

**Authentication:** Not required

**Success Response (200 OK):**
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

**Notes:**
- Password field is never included in the response
- This is a public endpoint and does not require authentication

---

### 2. Get Current User Profile

Get the profile of the currently authenticated user.

**Endpoint:** `GET /api/users/profile`

**Authentication:** Required (JWT token)

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Success Response (200 OK):**
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

**Error Responses:**

**401 Unauthorized** - Missing or Invalid Token:
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

### 3. Get User by ID

Retrieve a specific user by their ID.

**Endpoint:** `GET /api/users/:id`

**Authentication:** Required (JWT token)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | User ID |

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Success Response (200 OK):**
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

**Error Responses:**

**401 Unauthorized** - Missing or Invalid Token:
```json
{
  "meta": {
    "status": "error",
    "code": 401,
    "message": "Unauthorized"
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

### 4. Update User

Update user information.

**Endpoint:** `PUT /api/users/:id`

**Authentication:** Required (JWT token)

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | User ID |

**Headers:**
```
Authorization: Bearer <your-token-here>
```

**Request Body:**
All fields are optional. Only include fields you want to update.

```json
{
  "email": "newemail@example.com",
  "username": "New Username",
  "password": "newSecurePassword123",
  "image": "https://example.com/new-avatar.jpg"
}
```

**Field Details:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | No | Valid email address |
| username | string | No | Username (min 3, max 50 characters) |
| password | string | No | New password (min 6, max 50 characters) |
| image | string | No | Profile image URL |

**Validation Rules:**
- `email`: Must be a valid email format if provided
- `username`: Min 3 characters, max 50 characters if provided
- `password`: Min 6 characters, max 50 characters if provided
- Password will be automatically hashed if updated

**Success Response (200 OK):**
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

**401 Unauthorized** - Missing or Invalid Token:
```json
{
  "meta": {
    "status": "error",
    "code": 401,
    "message": "Unauthorized"
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

**Get all users:**
```bash
curl -X GET http://localhost:3000/api/users
```

**Get current user profile:**
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Get user by ID:**
```bash
curl -X GET http://localhost:3000/api/users/uuid-here \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Update user:**
```bash
curl -X PUT http://localhost:3000/api/users/uuid-here \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "username": "Updated Username",
    "image": "https://example.com/new-avatar.jpg"
  }'
```

**Update password:**
```bash
curl -X PUT http://localhost:3000/api/users/uuid-here \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newSecurePassword123"
  }'
```

---

## Notes

- **Authentication Required**: All endpoints except `GET /api/users` require a valid JWT token
- **Token Format**: Include the token in the Authorization header as `Bearer <token>`
- **Password Security**: Passwords are automatically hashed using bcrypt when updated
- **Password Not Returned**: User passwords are never included in API responses
- **Partial Updates**: The update endpoint supports partial updates - only send the fields you want to change
- **Profile Image**: The `image` field can store a URL to the user's profile picture