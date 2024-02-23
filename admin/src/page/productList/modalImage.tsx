import { PRODUCT_HEIGHT, PRODUCT_WIDTH } from "@/const"
import { setIsLoading } from "@/store"
import { dispatchError } from "@/utils/errorHandler"
import { handleImgError } from "@/utils/imgError"
import { Box, IconButton } from "@mui/material"
import { useState } from "react"
import { useDispatch } from "react-redux"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

export const ModalImage = (props: {
    imageIndex: number,
    imageFile?: File,
    setImageFile: (imageFile: File, imageIndex: number) => void
}) => {
    const [imageBase64Url, setImageBase64Url] = useState<string | null>(null)
    const dispatch = useDispatch()
    const getImagePreviewUrl = () => {
        if (imageBase64Url) {
            return imageBase64Url
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
                if (width !== PRODUCT_WIDTH ||
                    height !== PRODUCT_HEIGHT) {
                    dispatch(setIsLoading(false))
                    dispatchError(`高須為${PRODUCT_HEIGHT}px, 寬須為${PRODUCT_WIDTH}px`)
                    return
                }
                props.setImageFile(uploadedImageFile, props.imageIndex)
                setImageBase64Url(tempImageBase64Url)
                dispatch(setIsLoading(false))
            }
            tempImageDom.src = tempImageBase64Url
        };
        fileReader.readAsDataURL(uploadedImageFile);
    }
    return <Box sx={{ margin: 1, padding: 1, display: 'flex', justifyContent: 'center' }}>
        <img
            style={{
                width: "100%"
            }}
            src={getImagePreviewUrl()}
            onError={(e) => handleImgError(e)} />
        <IconButton color="primary" component="label">
            <AddPhotoAlternateIcon />
            <input hidden accept=".jpg" type="file" onChange={e => handleUploadImg(e)} />
        </IconButton>
        <div>上傳圖片 僅限 {PRODUCT_WIDTH}px x {PRODUCT_HEIGHT}px jpg檔案</div>
    </Box>
}