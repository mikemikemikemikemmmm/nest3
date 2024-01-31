import { BASE_URL, STATIC_API_PREFIX } from "../const"

export const getColorImageUrlApi = (colorId: number, timestamp: number) => {
    return `${BASE_URL}/${STATIC_API_PREFIX}/colors/${colorId}.jpg?timestamp=${timestamp}`
}
export const getImgUrlBySubProductIdApi =
    (subProductId: number) =>
        `${BASE_URL}/${STATIC_API_PREFIX}/subProducts/${subProductId}.jpg`
