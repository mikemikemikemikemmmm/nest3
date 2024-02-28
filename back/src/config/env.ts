import { join } from "path"

export const enum Enviroment {
    Development = "development",
    Production = "production"
}
export const isDevEnviroment = process.env.NODE_ENV === Enviroment.Development
export const getNowEnviroment = (): Enviroment => {
    return process.env.NODE_ENV as Enviroment
}
export const getEnvFilePath = () => {
    return join(__dirname,"..","..", `.env.${getNowEnviroment()}`)
}
const getDBFolderPath = ()=>{
    return join(__dirname,"..","..","db",getNowEnviroment())
}
export const geImageFolderPath = ()=>{
    return join(getDBFolderPath(),"images")
}
export const getDBUrl = () => {
    return join(getDBFolderPath(),"db.db")
}
export const getColorImageFilePath = (colorId: string) => {
    return join(geImageFolderPath(), "colors", `${colorId}.jpg`)
}
export const getSubproductImageFilePath = (spId: string) => {
    return join(geImageFolderPath(), "subproducts", `${spId}.jpg`)
}
export const getMenuBannerImageFilePath = (menuId: string) => {
    return join(geImageFolderPath(), "menu", `${menuId}.jpg`)
}
export const getProductImageFilePath = (productId: string, imageName: string) => {
    return join(geImageFolderPath(), "products", productId, `${imageName}.jpg`)
}
export const getProductImageFolderPath = (productId: string) => {
    return join(geImageFolderPath(), "products", productId)
}

