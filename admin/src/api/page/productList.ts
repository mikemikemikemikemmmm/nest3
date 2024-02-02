import { MobileStepperClassKey } from "@mui/material";
import { getBaseApi } from "../base";
import { GetOneResponse } from "../entityType";
interface ProductTree extends GetOneResponse.Product {
    subProducts: GetOneResponse.SubProduct[]
}
export const getProductTreeDataApi = (productId: number) =>
    getBaseApi<ProductTree>(`getProductTreeDataApi/${productId}`)