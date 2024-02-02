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
export interface ProductModalData extends UpdateDto.Product {
    id: number
}
export const ProductModal = (props: {
    modalDataProp: ProductModalData,
    closeModal: () => void,
    forcedRender: () => void,
}) => {
    const dispatch = useDispatch()
    const { modalDataProp, forcedRender, closeModal } = props
    const isCreate = modalDataProp.id === FAKE_ID_FOR_CREATE
    const [modalData, setModalData] = useState<ProductModalData>({ ...modalDataProp })
    const [nameHasFocused, setNameHasFocused] = useState(false)
    const handleSubmit = async () => {
        setNameHasFocused(true)
        if (modalData.name === '') {
            dispatchError('名稱為必須')
            return
        }
        if (isCreate) {
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
            closeModal()
            forcedRender()
        }
    }
    const handleChangeName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setModalData({ ...modalData, name: e.target.value })
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