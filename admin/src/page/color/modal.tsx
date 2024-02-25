import { useDispatch } from "react-redux"
import { CreateDto, GetOneResponse, UpdateDto } from "../../api/entityType"
import { useState } from "react"
import { COLOR_IMG_HEIGHT, COLOR_IMG_WIDTH, FAKE_ID_FOR_CREATE } from "../../const"
import { dispatchError } from "../../utils/errorHandler"
import { setIsLoading } from "../../store"
import { Box, Button, IconButton, TextField } from "@mui/material"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { handleImgError } from "../../utils/imgError"
import { getColorImageUrlApi } from "../../api/staticFile"
import { FieldWrapper } from "../../component/fieldWrapper"
import { createColorAPi, updateColorApi } from "@/api/page/color"
const COLOR_MODAL_IMG_DOM_ID = "COLOR_MODAL_IMG_DOM_ID"
export interface ColorModalData extends CreateDto.Color {
    id: number
}
export const ColorModal = (props: {
    modalDataProp: ColorModalData,
    colorsData: GetOneResponse.Color[],
    closeModal: () => void,
    forcedRender: () => void,
}) => {
    const dispatch = useDispatch()
    const { modalDataProp, forcedRender, closeModal, colorsData } = props
    const isCreate = modalDataProp.id === FAKE_ID_FOR_CREATE
    const [inputData, setInputData] = useState<ColorModalData>({ ...modalDataProp })
    const [imageBase64Url, setImageBase64Url] = useState<string | null>(null)
    const [nameError, setNameError] = useState(false)
    const handleSubmit = async () => {
        if (inputData.name === '') {
            setNameError(true)
            dispatchError('名稱為必須')
            return
        }
        setNameError(false)
        if (colorsData.find(c => c.name === inputData.name) &&
            isCreate
        ) {
            dispatchError('已有相同名稱的顏色')
            return
        }
        if (isCreate) {
            if (inputData.imageFile.size === 0) {
                dispatchError('圖片為必須')
                return
            }
            const execute = await createColorAPi(inputData)
            if (execute?.isSuccess) {
                closeModal()
                forcedRender()
            }
            return
        }
        const executeUpdate =
            await updateColorApi(inputData, modalDataProp.id)
        if (executeUpdate?.isSuccess) {
            closeModal()
            forcedRender()
        }
    }
    const handleChangeName = (val: string) => {
        if (val === "") {
            setNameError(true)
        } else {
            setNameError(false)
        }
        setInputData({ ...inputData, name: val })
    }
    const getImagePreviewUrl = () => {
        if (imageBase64Url) {
            return imageBase64Url
        }
        if (isCreate) {
            return undefined
        }
        return getColorImageUrlApi(modalDataProp.id)
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
                setInputData({ ...inputData, imageFile: uploadedImageFile })
                setImageBase64Url(tempImageBase64Url) //for COLOR_MODAL_IMG_DOM_ID element
                dispatch(setIsLoading(false))
            }
            tempImageDom.src = tempImageBase64Url
        };
        fileReader.readAsDataURL(uploadedImageFile);
    }
    return (
        <>
            <FieldWrapper
                label="名稱"
                error={nameError}
                value={inputData.name}
                onChange={val => handleChangeName(val)}
            />
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
                <div>上傳圖片 僅限 {COLOR_IMG_WIDTH}px x {COLOR_IMG_HEIGHT}px jpg檔案</div>
            </Box>
            <Button size="small" variant="contained" onClick={() => handleSubmit()}>
                送出
            </Button>
        </>
    )
}