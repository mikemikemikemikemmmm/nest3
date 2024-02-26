import { join } from "path"

export const enum Enviroment {
    Development = "development",
    Production = "production"
}
export const getNowEnviroment = (): Enviroment => {
    return process.env.NODE_ENV as Enviroment
}
export const getEnvFilePath = () => {
    return join(process.cwd(), `.env.${getNowEnviroment()}`)
}
export const getDBUrl = () => {
    return join(process.cwd(), "db", `${getNowEnviroment()}.db`)
}
export const getStaticFileFolderPath = () => {
    console.log(process.cwd(), "db", `${getNowEnviroment()}`)
    return join(process.cwd(), "db", `${getNowEnviroment()}`)
}
export const getColorImageFilePath = (colorId: string) => {
    return join(process.cwd(), "db", `${getNowEnviroment()}`, "colors", `${colorId}.jpg`)
}
export const getSubproductImageFilePath = (spId: string) => {
    return join(process.cwd(), "db", `${getNowEnviroment()}`, "subproducts", `${spId}.jpg`)
}
export const getMenuBannerImageFilePath = (menuId: string) => {
    return join(process.cwd(), "db", `${getNowEnviroment()}`, "menu", `${menuId}.jpg`)
}
export const getProductImageFilePath = (productId: string, imageName: string) => {
    return join(process.cwd(), "db", `${getNowEnviroment()}`, "products", productId, `${imageName}.jpg`)
}
export const getProductImageFolderPath = (productId: string) => {
    return join(process.cwd(), "db", `${getNowEnviroment()}`, "products", productId)
}

