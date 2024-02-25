import { DataSource } from "typeorm"

export const enum CacheStoreKey {
    NavDataEtag,
    NavData
}
interface NavDataItem{
    navId:number,
    navOrder:number,
    navText:string,
    navRoute:string,
    categoryId:number,
    categoryOrder:number,
    categoryText:string,
    categoryRoute:string,
    subCategoryId:number,
    subCategoryOrder:number,
    subCategoryText:string,
    subCategoryRoute:string,
}
const cacheStore = new Map<CacheStoreKey,string|NavDataItem[]>()
export const setCacheNavDataEtag =  ( val: string) => {
    cacheStore.set(CacheStoreKey.NavDataEtag,val)
} 
export const setCacheNavData =  (val: NavDataItem[]) => {
    cacheStore.set(CacheStoreKey.NavData,val)
} 
export const getCache =  (key: CacheStoreKey) => {
    cacheStore.get(key)
} 
export const hasCache = (key: CacheStoreKey) => {
    cacheStore.has(key)
} 
