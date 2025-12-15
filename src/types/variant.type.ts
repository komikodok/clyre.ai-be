export interface CreateProductVariant {
    productId: string
    name: string
    stock: number
    createdAt?: Date
    updatedAt?: Date
}