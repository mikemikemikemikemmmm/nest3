import { useDispatch } from "react-redux"
import { CreateDto, UpdateDto } from "../../api/entityType"
import { useState } from "react"
import { COLOR_IMG_HEIGHT, COLOR_IMG_WIDTH, FAKE_ID_FOR_CREATE, FORMDATA_KEY_FOR_FILE } from "../../const"
import { dispatchError } from "../../utils/errorHandler"
import { setIsLoading } from "../../store"
import { EntityName, createOneApi, updateOneByIdApi } from "../../api/entity"
import { Box, Button, IconButton, TextField } from "@mui/material"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { handleImgError } from "../../utils/imgError"
import { getColorImageUrlApi } from "../../api/staticFile"
const COLOR_MODAL_IMG_DOM_ID = "COLOR_MODAL_IMG_DOM_ID"
export interface ColorModalData extends CreateDto.Color {
    id: number
}
export const ColorModal = (props: {
    modalDataProp: ColorModalData,
    closeModal: () => void,
    forcedRender: () => void,
    setTimestamp?: (timeStamp: number) => void
}) => {
    const dispatch = useDispatch()
    const { modalDataProp, forcedRender, closeModal, setTimestamp } = props
    const isCreate = modalDataProp.id === FAKE_ID_FOR_CREATE
    const [modalData, setModalData] = useState<ColorModalData>(modalDataProp)
    const [nameHasFocused, setNameHasFocused] = useState(false)
    const [imageBase64Url, setImageBase64Url] = useState<string | null>(null)
    const handleSubmit = async () => {
        setNameHasFocused(true)
        if (modalData.name === '') {
            dispatchError('名稱為必須')
            return
        }
        if (isCreate) {
            if (!modalData.imageFile) {
                dispatchError('圖片為必須')
                return
            }
            const execute =
                await createOneApi<CreateDto.Color>(EntityName.Color, modalData as CreateDto.Color)
            if (!execute.error) {
                closeModal()
                forcedRender()
            }
            return
        }
        const executeUpdate =
            await updateOneByIdApi<UpdateDto.Color>(EntityName.Color, modalDataProp.id, modalData)
        if (!executeUpdate.error) {
            if (modalData.imageFile && setTimestamp) {
                setTimestamp(new Date().getTime())
            }
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
            return getColorImageUrlApi(modalDataProp.id, 0)
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
                if (width !== COLOR_IMG_WIDTH ||
                    height !== COLOR_IMG_HEIGHT) {
                    dispatch(setIsLoading(false))
                    dispatchError(`長寬有一不為${COLOR_IMG_WIDTH}px`)
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
                    id={COLOR_MODAL_IMG_DOM_ID}
                    style={{
                        width: imageBase64Url ? COLOR_IMG_WIDTH : 0,
                        height: imageBase64Url ? COLOR_IMG_HEIGHT : 0
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