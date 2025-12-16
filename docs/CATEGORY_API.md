# Category API Documentation

## Base URL
```
/api/categories
```

## Endpoints

### 1. Get All Categories

Retrieve a list of all categories with optional search filtering.

**Endpoint:** `GET /api/categories`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Filter categories by name (case-insensitive) |

**Success Response (200 OK):**
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

**Example Requests:**
```bash
# Get all categories
GET /api/categories

# Search categories
GET /api/categories?search=electronics
```

---

### 2. Create Category

Create a new category.

**Endpoint:** `POST /api/categories`

**Request Body:**
```json
{
  "name": "electronics"
}
```

**Validation Rules:**
- `name`: Required, string, min 3 characters, max 50 characters
- Name will be automatically converted to lowercase

**Success Response (201 Created):**
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

**409 Conflict** - Category Already Exists:
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

### 3. Delete Category

Delete a category by ID.

**Endpoint:** `DELETE /api/categories/:id`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | Category ID |

**Success Response (200 OK):**
```json
{
  "meta": {
    "status": "success",
    "code": 200,
    "message": "Category deleted successfully."
  }
}
```

**Error Responses:**

**404 Not Found** - Category Not Found:
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

## Examples

### cURL Examples

**Get all categories:**
```bash
curl -X GET http://localhost:3000/api/categories
```

**Search categories:**
```bash
curl -X GET "http://localhost:3000/api/categories?search=electronics"
```

**Create a category:**
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "electronics"}'
```

**Delete a category:**
```bash
curl -X DELETE http://localhost:3000/api/categories/uuid-here
```

---

## Notes

- All category names are automatically converted to lowercase
- Category names must be unique
- Deleting a category may fail if there are products associated with it (depending on database constraints)
