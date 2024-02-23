export type NavigationTreeItemType = "menu" | "category" | "subCategory" | "series"

export namespace CreateDto {
    interface ImageFileMixin {
        imageFile: File
    }
    export interface NavigationTreeItem {
        name: string,
        order: number,
        route: string,
        parentId: number,
        type: NavigationTreeItemType
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
    export interface Series {
        name: string,
        order: number,
        subCategoryId: number
    }
    export interface Product {
        "name": string,
        "order": number
        "genderId": number
        "seriesId": number,
        imageFiles: File[]
    }
    export interface SubProduct extends ImageFileMixin {
        productId: number,
        colorId: number,
        price: number
        order: number
        sizeIdList: number[]
    }
    export interface Color extends ImageFileMixin {
        name: string
    }
    export interface Gender {
        name: string
    }
    export interface Size {
        name: string,
        order: number
    }
    export interface Stock {
        subproductId: number,
        sizeId: number
    }
}
export namespace UpdateDto {
    export type User = Partial<CreateDto.User>
    export type Editing = Partial<CreateDto.Editing>
    export type Gender = Partial<CreateDto.Gender>
    export type Color = Partial<CreateDto.Color>
    export type NavigationTreeItem = Partial<CreateDto.NavigationTreeItem>
    export type Series = Partial<CreateDto.Series>
    export type Product = Partial<CreateDto.Product>
    export type SubProduct = Partial<CreateDto.SubProduct>
    export type Size = Partial<CreateDto.Size>
    export type Stock = { stock: number }
}
export namespace GetOneResponse {
    interface IdMixin {
        id: number,
        updated_at: string
    }
    export type User = CreateDto.User & IdMixin
    export type Editing = CreateDto.Editing & IdMixin
    export type Gender = CreateDto.Gender & IdMixin
    export type Color = CreateDto.Color & IdMixin
    export type Series = CreateDto.Series & IdMixin & {
        navigationName: string
    }
    export type Product = CreateDto.Product & IdMixin & {
        genderName: string, navigationName: string, imageCount: number
    }
    export type SubProduct = CreateDto.SubProduct & IdMixin & {
        colorName: string,
    }
    export type Size = CreateDto.Size & IdMixin

    export type ProductCard = Product &
    {
        genderName: string,
        subproductId: number
    }
    export interface NavigationItem {
        menuId: number
        menuName: string
        menuRoute: string
        menuOrder: number
        categoryId: number
        categoryName: string
        categoryRoute: string
        categoryOrder: number
        subCategoryId: number
        subCategoryName: string
        subCategoryRoute: string
        subCategoryOrder: number
    }
    export type Stock = CreateDto.Stock & IdMixin & {
        stock: number
    }
}