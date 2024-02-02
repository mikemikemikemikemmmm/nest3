import { getBaseApi } from "../base";
import { EntityName } from "../entity";
export interface SeriesTreeItem {
    id: number,
    name: string,
    order: number,
    products: [

    ]
}
export const getSeriesTreeBySubCategoryIdApi =
    (SubCategoryId: number) => getBaseApi<SeriesTreeItem[]>(`getSeriesBySubCategoryIdApi/${SubCategoryId}`)


export type NavigationTreeItemType = EntityName.Menu | EntityName.Category | EntityName.SubCategory
export interface NavigationTreeItem {
    id: number,
    name: string,
    order: number,
    type: NavigationTreeItemType,
    parentId: number,
    children: NavigationTreeItem[]
}
export const getNavigationTreeApi =
    () => getBaseApi<NavigationTreeItem[]>(`getNavigationTreeApi`)
