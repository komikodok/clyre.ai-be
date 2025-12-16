# Variant API Documentation

## Base URL
```
/api/variants
```

## Endpoints

### 1. Get All Variants

Retrieve a list of all product variants with optional search filtering.

**Endpoint:** `GET /api/variants`

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| search | string | No | Filter variants by name (case-insensitive) |

**Success Response (200 OK):**
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

**Example Requests:**
```bash
# Get all variants
GET /api/variants

# Search variants
GET /api/variants?search=large
```

---

### 2. Create Variant

Create a new product variant.

**Endpoint:** `POST /api/variants`

**Request Body:**
```json
{
  "name": "Large",
  "stock": 20,
  "productId": "product-uuid"
}
```

**Field Details:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Variant name (min 3, max 50 characters) |
| stock | number | Yes | Available stock (must be >= 0) |
| productId | string (UUID) | Yes | Product ID (max 38 characters) |

**Validation Rules:**
- `name`: Required, string, min 3 characters, max 50 characters
- `stock`: Required, number, must be >= 0
- `productId`: Required, string, max 38 characters
- Name will be automatically converted to lowercase
- Variant name must be unique

**Success Response (201 Created):**
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
- Name too short (less than 3 characters)
- Name too long (more than 50 characters)
- Stock is negative
- Missing required fields

**409 Conflict** - Variant Already Exists:
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

### 3. Delete Variant

Delete a variant by ID.

**Endpoint:** `DELETE /api/variants/:id`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | Variant ID |

**Success Response (200 OK):**
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

**Error Responses:**

**404 Not Found** - Variant Not Found:
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

## Examples

### cURL Examples

**Get all variants:**
```bash
curl -X GET http://localhost:3000/api/variants
```

**Search variants:**
```bash
curl -X GET "http://localhost:3000/api/variants?search=large"
```

**Create a variant:**
```bash
curl -X POST http://localhost:3000/api/variants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Large",
    "stock": 20,
    "productId": "product-uuid-here"
  }'
```

**Delete a variant:**
```bash
curl -X DELETE http://localhost:3000/api/variants/uuid-here
```

---

## Use Cases

### Common Variant Types

Variants are typically used for product variations such as:

**Size Variants:**
```json
{ "name": "Small", "stock": 10, "productId": "..." }
{ "name": "Medium", "stock": 15, "productId": "..." }
{ "name": "Large", "stock": 20, "productId": "..." }
{ "name": "XL", "stock": 8, "productId": "..." }
```

**Color Variants:**
```json
{ "name": "Red", "stock": 12, "productId": "..." }
{ "name": "Blue", "stock": 18, "productId": "..." }
{ "name": "Black", "stock": 25, "productId": "..." }
```

**Specification Variants:**
```json
{ "name": "8GB RAM", "stock": 10, "productId": "..." }
{ "name": "16GB RAM", "stock": 15, "productId": "..." }
{ "name": "32GB RAM", "stock": 5, "productId": "..." }
```

---

## Notes

- **Lowercase Conversion**: All variant names are automatically converted to lowercase for consistency
- **Uniqueness**: Variant names must be unique across the entire system (not just per product)
- **Stock Management**: Each variant maintains its own stock count independent of the parent product
- **No Update Endpoint**: Currently, there is no update endpoint for variants. To modify a variant, delete and recreate it
- **Product Association**: Variants must be associated with an existing product via `productId`
