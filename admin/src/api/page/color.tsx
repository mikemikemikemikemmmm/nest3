import { FORMDATA_KEY_FOR_DTO, KEY_FOR_UPLOAD_IMAGE_FORM_DATA } from "@/const"
import { CreateDto, UpdateDto } from "../entityType"
import { EntityName } from "../entity"
import { postBaseApi, putBaseApi } from "../base"


export const createColorAPi = (createDto: CreateDto.Color) => {
    const formData = new FormData()
    formData.append(KEY_FOR_UPLOAD_IMAGE_FORM_DATA, createDto.imageFile)
    const copy: Partial<CreateDto.Color> = {...createDto}
    delete copy.imageFile
    formData.append(FORMDATA_KEY_FOR_DTO, JSON.stringify(copy))
    return postBaseApi(`entity/${EntityName.Color}`, formData)
}
export const updateColorApi = (updateDto: UpdateDto.Color, id: number) => {
    const formData = new FormData()
    const copy = {...updateDto}
    if (copy.imageFile) {
        formData.append(KEY_FOR_UPLOAD_IMAGE_FORM_DATA, copy.imageFile)
        delete copy.imageFile
    }
    formData.append(FORMDATA_KEY_FOR_DTO, JSON.stringify(copy))
    return putBaseApi(`entity/${EntityName.Color}/${id}`, formData)
}
