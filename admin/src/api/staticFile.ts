import { BASE_URL, FAKE_ID_FOR_CREATE, STATIC_API_PREFIX } from "../const"

export const getColorImageUrlApi = (colorId: number, updated_at?: string) =>
    colorId === FAKE_ID_FOR_CREATE ?
        undefined
        :
        `${BASE_URL}/${STATIC_API_PREFIX}/colors/${colorId}.jpg?updated_at=${updated_at}`

export const getProductImgUrlApi =
    (productId: number, index: number, updated_at: string = "") =>
        `${BASE_URL}/${STATIC_API_PREFIX}/products/${productId}/${index}.jpg?updated_at=${updated_at}`

export const getImgUrlBySubProductIdApi =
    (subProductId: number, updated_at?: string) =>
        subProductId === FAKE_ID_FOR_CREATE ?
            undefined
            :
            `${BASE_URL}/${STATIC_API_PREFIX}/subProducts/${subProductId}.jpg?updated_at=${updated_at}`
