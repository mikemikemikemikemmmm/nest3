import { useState } from "react"
import { CreateDto, UpdateDto } from "../../api/entityType"
import { FAKE_ID_FOR_CREATE, SUB_PRODUCT_IMG_HEIGHT, SUB_PRODUCT_IMG_WIDTH, SUB_PRODUCT_MODAL_IMG_DOM_ID } from "../../const"
import { dispatchError } from "../../utils/errorHandler"
import { setIsLoading } from "../../store"
import { getImgUrlBySubProductIdApi } from "../../api/staticFile"
import { useDispatch } from "react-redux"
import { EntityName, createOneApi, updateOneByIdApi } from "../../api/entity"
import { handleImgError } from "../../utils/imgError"
import { Box, Button, IconButton, TextField } from "@mui/material"
export interface SubProductModalData extends CreateDto.SubProduct {
    id: number
}
interface Props {
    modalDataProp: SubProductModalData,
    closeModal: () => void,
}
export const SubProductModal = (props: Props) => {
    const dispatch = useDispatch()
    const { modalDataProp, closeModal } = props
    const isCreate = modalDataProp.id === FAKE_ID_FOR_CREATE
    const [modalData, setModalData] = useState<SubProductModalData>({ ...modalDataProp })
    const [imageBase64Url, setImageBase64Url] = useState<string | null>(null)
    const handleChangeData = () => {

    }
    const handleSubmit = async () => {
        if (modalData.name === '') {
            dispatchError('名稱為必須')
            return
        }
        let executeApi
        if (isCreate) {
            if (!modalData.imageFile) {
                dispatchError('圖片為必須')
                return
            }
            executeApi =
                await createOneApi<CreateDto.SubProduct>(EntityName.SubProduct, modalData as CreateDto.SubProduct)
        } else {
            executeApi =
                await updateOneByIdApi<UpdateDto.SubProduct>(EntityName.SubProduct, modalDataProp.id, modalData)
        }
        if (!executeApi.error) {
            closeModal()
            forcedRender()
        }
    }
    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setModalData({ ...modalData, name: e.target.value })
    }
    const getImagePreviewUrl = () => {
        if (imageBase64Url) {
            return imageBase64Url
        }
        if (isCreate) {
            return getImgUrlBySubProductIdApi(modalDataProp.id)
        }
        return ""
    }
    const handleUploadImg = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedImageFile = e.target.files?.[0]
        if (!uploadedImageFile) {
            dispatchError('上傳圖片失敗')
            return
        }
        dispatch(setIsLoading(true))
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            if (!e.target?.result) {
                dispatch(setIsLoading(false))
                dispatchError('上傳圖片失敗')
                return
            }
            const tempImageBase64Url = e.target.result as string
            const tempImageDom = new Image()
            tempImageDom.onload = () => {
                const { width } = tempImageDom
                const { height } = tempImageDom
                if (width !== SUB_PRODUCT_IMG_WIDTH ||
                    height !== SUB_PRODUCT_IMG_HEIGHT) {
                    dispatch(setIsLoading(false))
                    dispatchError(`長寬有一不為${SUB_PRODUCT_IMG_WIDTH}px`)
                    return
                }
                setModalData({ ...modalData, imageFile: uploadedImageFile })
                setImageBase64Url(tempImageBase64Url) //for COLOR_MODAL_IMG_DOM_ID element
                dispatch(setIsLoading(false))
            }
            tempImageDom.src = tempImageBase64Url
        };
        fileReader.readAsDataURL(uploadedImageFile);
    }
    return (
        <>
            <TextField
                sx={{ color: 'black' }}
                label="名稱"
                onBlur={() => setNameHasFocused(true)}
                error={modalData.name === '' && nameHasFocused}
                variant="outlined"
                defaultValue={modalData.name}
                onChange={(e) => handleChangeName(e)} />
            <Box sx={{ margin: 1, padding: 1, display: 'flex', justifyContent: 'center' }}>
                <img
                    id={SUB_PRODUCT_MODAL_IMG_DOM_ID}
                    style={{
                        width: imageBase64Url ? SUB_PRODUCT_IMG_WIDTH : 0,
                        height: imageBase64Url ? SUB_PRODUCT_IMG_HEIGHT : 0
                    }}
                    src={getImagePreviewUrl()}
                    onError={(e) => handleImgError(e)} />
                <IconButton color="primary" component="label">
                    <AddPhotoAlternateIcon />
                    <input hidden accept=".jpg" type="file" onChange={e => handleUploadImg(e)} />
                </IconButton>
            </Box>
            <div>上傳圖片 僅限 48px x 48px jpg檔案</div>
            <Button variant="contained" onClick={() => handleSubmit()}>送出</Button>
        </>
    )
}