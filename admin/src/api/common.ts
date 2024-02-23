
import { QueryParams } from "../type"
import { getBaseApi } from "./base"
import { EntityName } from "./entity"
import { GetOneResponse } from "./entityType"
export const getProductCardsApi = (queryParams?: QueryParams) =>
    getBaseApi<GetOneResponse.ProductCard[]>(`entity/${EntityName.Product}/cards`, queryParams)
