//layout
export const enum ZIndex {
    Loading = 1,
    Alert = 3,
    Modal = 4
}
export const DRAWER_WIDTH = 200
export const COLOR_IMG_WIDTH = 48
export const COLOR_IMG_HEIGHT = COLOR_IMG_WIDTH
export const SUB_PRODUCT_IMG_WIDTH = 500
export const SUB_PRODUCT_IMG_HEIGHT = SUB_PRODUCT_IMG_WIDTH
export const COLOR_MODAL_IMG_DOM_ID = "COLOR_MODAL_IMG_DOM_ID"
export const SUB_PRODUCT_MODAL_IMG_DOM_ID = "SUB_PRODUCT_MODAL_IMG_DOM_ID"

export const PRODUCT_UPLOAD_IMG_KEY = "PRODUCT_UPLOAD_IMG_KEY"
export const getProductUploadImgKey = (imageIndex: number) => `${PRODUCT_UPLOAD_IMG_KEY}_${imageIndex}`
export const PRODUCT_WIDTH = 760
export const PRODUCT_HEIGHT = 910

//system
export const BASE_URL = import.meta.env.VITE_DB_BASE_URL
export const ADMIN_API_PREFIX = "admin"
export const STATIC_API_PREFIX = 'static'
export const KEY_FOR_UPLOAD_IMAGE_FORM_DATA = "KEY_FOR_UPLOAD_IMAGE_FORM_DATA"
export const FORMDATA_KEY_FOR_DTO = 'stringifyJson'
export const FAKE_ID_FOR_CREATE = -99
export const TOKEN_HEADER = "token"
export const CREATE_PRODUCT_BY_SERIES_ID_QUERY_STR = "createProductBySeriesId"