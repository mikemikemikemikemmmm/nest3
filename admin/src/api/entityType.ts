
export namespace CreateDto {
    interface ImageFileMixin{
        imageFile:File
    }
    interface NavItemMixin {
        name: string,
        order: number,
        route: string
    }
    export interface User {
        email: string
        password: string
    }
    export interface Editing {
        targetEntity: string,
        targetId: number,
        user: string
    }
    export interface Menu extends NavItemMixin {
    }
    export interface Category extends NavItemMixin {
        navId: number
    }
    export interface SubCategory extends NavItemMixin {
        categoryId: number
    }
    export interface Series {
        name: string,
        order: number,
        subCategoryId: number
    }
    export interface Product {
        name: string,
        order: number
        genderId: number
        seriesId: number,
    }
    export interface SubProduct extends ImageFileMixin{
        productId: number,
        colorId: number,
        price: number
        order: number
    }
    export interface Color extends ImageFileMixin{
        name: string
    }
    export interface Gender {
        name: string
    }
    export interface Size {
        name: string
    }
}
export namespace UpdateDto{
    export type User = Partial<CreateDto.User>
    export type Editing = Partial<CreateDto.Editing>
    export type Gender = Partial<CreateDto.Gender>
    export type Color = Partial<CreateDto.Color>
    export type Menu = Partial<CreateDto.Menu>
    export type Category = Partial<CreateDto.Category>
    export type SubCategory = Partial<CreateDto.SubCategory>
    export type Series = Partial<CreateDto.Series>
    export type Product = Partial<CreateDto.Product>
    export type SubProduct = Partial<CreateDto.SubProduct>
    export type Size = Partial<CreateDto.Size>
}
interface IdMixin {
    id:number
}
export namespace GetOneResponse{
    export type User = CreateDto.User & IdMixin
    export type Editing = CreateDto.Editing & IdMixin
    export type Gender = CreateDto.Gender & IdMixin
    export type Color = CreateDto.Color & IdMixin
    export type Menu =CreateDto.Menu & IdMixin
    export type Category = CreateDto.Category & IdMixin
    export type SubCategory = CreateDto.SubCategory & IdMixin
    export type Series = CreateDto.Series & IdMixin
    export type Product = CreateDto.Product & IdMixin
    export type SubProduct = CreateDto.SubProduct & IdMixin
    export type Size = CreateDto.Size & IdMixin
}