import { deleteBaseApi, getBaseApi, postBaseApi, putBaseApi } from "../base";
import { EntityName } from "../entity";
import { CreateDto, GetOneResponse, NavigationTreeItemType, UpdateDto } from "../entityType";
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
export const getNavigationTreeApi = //TODO
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
