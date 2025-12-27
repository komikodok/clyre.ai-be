export interface IUser {
    id?: string
    email: string
    username: string
    password?: string
    confirm_password?: string
    image?: string
    created_at?: Date;
    updated_at?: Date;
}