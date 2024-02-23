import { BASE_URL, STATIC_FILE_PREFIX } from "../config"

STATIC_FILE_PREFIX
//img 
export const getProductCardImgUrlApi = (subproductId: number) => `${BASE_URL}/${STATIC_FILE_PREFIX}/subProducts/${subproductId}.jpg`
export const getSubproductImgUrlInDetailPageApi = (subproductId?: number) => {
    if (subproductId) {
        return `${BASE_URL}/${STATIC_FILE_PREFIX}/subProducts/${subproductId}.jpg`
    }
}
// export const getNavBannerImgUrlApi = (navRoute: string) => `${BASE_URL}/${STATIC_FILE_PREFIX}/nav/${navRoute}.jpg`
export const getColorImgUrlApi = (colorId: number) => `${BASE_URL}/${STATIC_FILE_PREFIX}/colors/${colorId}.jpg`