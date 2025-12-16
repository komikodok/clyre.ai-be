export type ProductQueryParams = {
    page?: number,
    limit?: number,
    search?: string,
    sort?: 'asc' | 'desc'
}

export type CreateProductData = {
    sku?: string,
    name: string,
    slug?: string,
    description?: string,
    priceAmount: number,
    priceCurrency?: 'IDR' | 'USD',
    stock?: number,
    categoryId: string,
}

export type UpdateProductData = {
    sku?: string,
    name?: string,
    slug?: string,
    description?: string,
    priceAmount?: number,
    priceCurrency?: 'IDR' | 'USD',
    stock?: number,
    categoryId?: string,
}