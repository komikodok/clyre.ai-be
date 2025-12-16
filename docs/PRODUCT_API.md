# Product API Documentation

## Base URL
```
/api/products
```

## Endpoints

### 1. Get All Products

Retrieve a list of all products with pagination, search, and sorting capabilities.

**Endpoint:** `GET /api/products`

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | number | No | 1 | Page number for pagination |
| limit | number | No | 10 | Number of items per page |
| search | string | No | - | Search by product name or SKU |
| sort | string | No | asc | Sort order: `asc` or `desc` |

**Success Response (200 OK):**
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

**Example Requests:**
```bash
# Get all products (default pagination)
GET /api/products

# Get products with custom pagination
GET /api/products?page=2&limit=20

# Search products
GET /api/products?search=laptop

# Sort products descending
GET /api/products?sort=desc

# Combined filters
GET /api/products?page=1&limit=5&search=gaming&sort=desc
```

---

### 2. Get Product by ID

Retrieve a single product by its ID.

**Endpoint:** `GET /api/products/:id`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | Product ID |

**Success Response (200 OK):**
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

**Error Responses:**

**404 Not Found** - Product Not Found:
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

### 3. Create Product

Create a new product.

**Endpoint:** `POST /api/products`

**Request Body:**
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

**Field Details:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Product name |
| priceAmount | number | Yes | Product price (must be positive) |
| categoryId | string (UUID) | Yes | Category ID (must exist) |
| sku | string | No | Stock Keeping Unit |
| slug | string | No | URL-friendly identifier (auto-generated from name if not provided) |
| description | string | No | Product description |
| priceCurrency | string | No | Currency code: `IDR` or `USD` (default: `IDR`) |
| stock | number | No | Available stock (default: 0, must be >= 0) |

**Validation Rules:**
- `priceAmount` must be a positive number
- `stock` must be >= 0
- `slug` must be unique (auto-generated from name if not provided)
- `categoryId` must reference an existing category

**Success Response (201 Created):**
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

**404 Not Found** - Category Not Found:
```json
{
  "meta": {
    "status": "error",
    "code": 404,
    "message": "Category not found"
  }
}
```

**409 Conflict** - Slug Already Exists:
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

### 4. Update Product

Update an existing product.

**Endpoint:** `PATCH /api/products/:id`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | Product ID |

**Request Body:**
All fields are optional. Only include fields you want to update.

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

**Validation Rules:**
- Same validation rules as create
- If `name` is updated without `slug`, slug will be auto-generated from the new name
- `slug` must be unique (cannot conflict with other products)
- `categoryId` must reference an existing category if provided

**Success Response (200 OK):**
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

**404 Not Found** - Product or Category Not Found:
```json
{
  "meta": {
    "status": "error",
    "code": 404,
    "message": "Product not found"
  }
}
```

**409 Conflict** - Slug Already Exists:
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

### 5. Delete Product

Delete a product by ID.

**Endpoint:** `DELETE /api/products/:id`

**URL Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | string (UUID) | Yes | Product ID |

**Success Response (200 OK):**
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

**Error Responses:**

**404 Not Found** - Product Not Found:
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

## Examples

### cURL Examples

**Get all products:**
```bash
curl -X GET http://localhost:3000/api/products
```

**Get products with pagination:**
```bash
curl -X GET "http://localhost:3000/api/products?page=1&limit=5"
```

**Search products:**
```bash
curl -X GET "http://localhost:3000/api/products?search=laptop"
```

**Get product by ID:**
```bash
curl -X GET http://localhost:3000/api/products/uuid-here
```

**Create a product:**
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

**Update a product:**
```bash
curl -X PATCH http://localhost:3000/api/products/uuid-here \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Laptop Gaming",
    "priceAmount": 16000000,
    "stock": 15
  }'
```

**Delete a product:**
```bash
curl -X DELETE http://localhost:3000/api/products/uuid-here
```

---

## Notes

- **Slug Auto-generation**: If no slug is provided during creation or update (with name change), it will be automatically generated from the product name (lowercase, spaces replaced with hyphens)
- **Pagination**: Default pagination is 10 items per page
- **Search**: Searches both product name and SKU fields
- **Relations**: Product responses include related category, images, and variants data
- **Currency**: Supported currencies are IDR (Indonesian Rupiah) and USD (US Dollar)
