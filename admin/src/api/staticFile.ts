import { BASE_URL, FAKE_ID_FOR_CREATE, STATIC_API_PREFIX } from "../const"

export const getColorImageUrlApi = (colorId: number, updated_at: string ="") =>
    colorId === FAKE_ID_FOR_CREATE ?
        undefined
        :
        `${BASE_URL}/${STATIC_API_PREFIX}/colors/${colorId}.jpg?updated_at=${updated_at}`

export const getProductImgUrlApi =
    (productId: number, imageName: string, updated_at: string = "") =>
        `${BASE_URL}/${STATIC_API_PREFIX}/products/${productId}/${imageName}.jpg?updated_at=${Math.random()}`

export const getMenuBannerImgUrlApi =
    (menuId: number, random: number) =>
        menuId === FAKE_ID_FOR_CREATE ?
            undefined
            :
            `${BASE_URL}/${STATIC_API_PREFIX}/menu/${menuId}.jpg?random=${random}`

export const getImgUrlBySubProductIdApi =
    (subProductId: number, updated_at: string = "") =>
        subProductId === FAKE_ID_FOR_CREATE ?
            undefined
            :
            `${BASE_URL}/${STATIC_API_PREFIX}/subproducts/${subProductId}.jpg?updated_at=${updated_at}`
