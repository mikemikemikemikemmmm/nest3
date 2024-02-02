import { getBaseApi } from "../base";
import { GetOneResponse } from "../entityType";
export interface ResponseProductCard {
    id: number,
    firstSubProductId: number
    name: string
}
export const getProductCardDataByColorIdApi =
    (colorId: number) => getBaseApi<ResponseProductCard[]>(`getProductCardDataByColorIdApi/${colorId}`)

export const getColorsBySearchNameApi =
    (colorName: string) => getBaseApi<GetOneResponse.Color[]>(`getColorsBySearchNameApi/${colorName}`)
