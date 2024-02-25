import { RequestMethod } from "@nestjs/common";

export const PRODUCT_IMG_WIDTH = 760;
export const PRODUCT_IMG_HEIGHT = 910;
export const PRODUCT_IMG_MAX_SIZE = 100 * 1024 // 500kb

export const SUB_PRODUCT_IMG_WIDTH = 500;
export const SUB_PRODUCT_IMG_HEIGHT = 500;
export const SUB_PRODUCT_IMG_MAX_SIZE = 100 * 1024 // 500kb

export const COLOR_IMG_WIDTH = 48;
export const COLOR_IMG_HEIGHT = 48;
export const COLOR_IMG_MAX_SIZE = 5 * 1024 // 5kb

export const MENU_BANNER_IMG_WIDTH = 1010;
export const MENU_BANNER_IMG_HEIGHT = 400;
export const MENU_BANNER_IMG_MAX_SIZE = 100 * 1024 // 500kb

export const KEY_FOR_UPLOAD_IMAGE_FORM_DATA = "KEY_FOR_UPLOAD_IMAGE_FORM_DATA"
export const KEY_FOR_STRINGIGY_FORM_DATA = "stringifyJson"


export enum USER_ROLE {
    Admin = "admin",
    Guest = "guest"
}
export const USER_ROLE_ALLOW_METHODS = {
    "admin": ["GET", "POST", "DELETE", "PUT"],
    "guest": ["GET"],
}