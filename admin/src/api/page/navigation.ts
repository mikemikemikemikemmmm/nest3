import { FORMDATA_KEY_FOR_DTO, KEY_FOR_UPLOAD_IMAGE_FORM_DATA } from "@/const";
import { deleteBaseApi, getBaseApi, postBaseApi, putBaseApi } from "../base";
import { EntityName } from "../entity";
import { CreateDto, GetOneResponse, NavigationTreeItemType, UpdateDto } from "../entityType";
import { dispatchError } from "@/utils/errorHandler";
export interface SeriesTreeItem {
    id: number,
    name: string,
    order: number,
    products: GetOneResponse.ProductCard[]
}
export const getSeriesTreeBySubCategoryIdApi =
    (SubCategoryId: number) => getBaseApi<SeriesTreeItem[]>(`entity/${EntityName.Series}/tree/${SubCategoryId}`)

export const getNavigationParentsApi =
    (parentType: NavigationTreeItemType) => getBaseApi<GetOneResponse.NavigationItem[]>(`entity/${EntityName.Navigation}/${parentType}`)


export interface NavigationTreeItem extends CreateDto.NavigationTreeItem {
    id: number,
    children: NavigationTreeItem[]
}
export const getNavigationTreeApi =
    () => getBaseApi<NavigationTreeItem[]>(`entity/${EntityName.Navigation}/tree`)


export const createNavigationApi =
    (createDto: CreateDto.NavigationTreeItem) =>
        postBaseApi(`entity/${EntityName.Navigation}`, createDto)
export const updateNavigationApi =
    (id: number, updateDto: UpdateDto.NavigationTreeItem) =>
        putBaseApi(`entity/${EntityName.Navigation}/${id}`, updateDto)
export const deleteNavigationApi =
    (navigationType: NavigationTreeItemType, selfId: number) =>
        deleteBaseApi(`entity/${EntityName.Navigation}/${navigationType}/${selfId}`)


export const createMenuApi =
    (createDto: CreateDto.NavigationTreeItem) => {
        const formData = new FormData()
        console.log(createDto)
        if (!createDto.imageFile || createDto.imageFile.size === 0) {
            dispatchError("圖片為必須")
            return
        }
        formData.append(KEY_FOR_UPLOAD_IMAGE_FORM_DATA, createDto.imageFile)
        const copy: Partial<typeof createDto> = { ...createDto }
        delete copy.imageFile
        formData.append(FORMDATA_KEY_FOR_DTO, JSON.stringify(copy))
        return postBaseApi(`entity/${EntityName.Navigation}/menu`, formData)
    }
export const updateMenuApi =
    (menuId: number, updateDto: UpdateDto.NavigationTreeItem) => {
        const formData = new FormData()
        if (updateDto.imageFile) {
            formData.append(KEY_FOR_UPLOAD_IMAGE_FORM_DATA, updateDto.imageFile)
        }
        const copy: Partial<typeof updateDto> = { ...updateDto }
        delete copy.imageFile
        formData.append(FORMDATA_KEY_FOR_DTO, JSON.stringify(copy))
        return putBaseApi(`entity/${EntityName.Navigation}/menu/${menuId}`, formData)
    }