import { BASE_URL, STATIC_FILE_PREFIX } from "../config"
//img 
export const getProductImgUrlApi = (productId: number,imgName:string) => `${BASE_URL}/${STATIC_FILE_PREFIX}/products/${productId}/${imgName}.jpg`
export const getProductCardImgUrlApi = (subproductId: number) => `${BASE_URL}/${STATIC_FILE_PREFIX}/subProducts/${subproductId}.jpg`
export const getSubproductImgUrlInDetailPageApi = (subproductId?: number) => {
    if (subproductId) {
        return `${BASE_URL}/${STATIC_FILE_PREFIX}/subProducts/${subproductId}.jpg`
    }
}
export const getMenuBannerImgUrlApi = (menuId: string) => `${BASE_URL}/${STATIC_FILE_PREFIX}/menu/${menuId}.jpg`
export const getColorImgUrlApi = (colorId: number) => `${BASE_URL}/${STATIC_FILE_PREFIX}/colors/${colorId}.jpg`