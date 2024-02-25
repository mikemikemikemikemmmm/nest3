import { useRef, useState } from "react";
import { NavigationTreeItem, createMenuApi, createNavigationApi, updateMenuApi, updateNavigationApi } from "../../api/page/navigation";
import { Box, Button, IconButton, TextField } from "@mui/material";
import { FieldWrapper } from "../../component/fieldWrapper";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { isInputValid, isModalAllInputValid } from "@/utils/textInput";
import { EntityName, createOneApi, updateOneByIdApi } from "@/api/entity";
import { FAKE_ID_FOR_CREATE, MENU_BANNER_HEIGHT, MENU_BANNER_WIDTH } from "@/const";
import { CreateDto } from "@/api/entityType";
import { dispatchError } from "@/utils/errorHandler";
import { setIsLoading } from "@/store";
import { useDispatch } from "react-redux";
import { handleImgError } from "@/utils/imgError";
import { getMenuBannerImgUrlApi } from "@/api/staticFile";
export type NavigationModalDataProp = NavigationTreeItem & { parentName: string }
export const NavigationModal = (props: {
    modalDataProp: NavigationModalDataProp,
    renderToGetData: () => void
    closeModal: () => void,
}) => {
    const { modalDataProp, closeModal, renderToGetData } = props
    const [inputData, setInputData] = useState<CreateDto.NavigationTreeItem>({
        name: modalDataProp.name,
        order: modalDataProp.order,
        parentId: modalDataProp.type === "menu" ? 99 : modalDataProp.parentId,
        route: modalDataProp.type === "series" ? "該元素無路徑" : modalDataProp.route,
        type: modalDataProp.type,
        imageFile: undefined
    })
    const [toggle, setToggle] = useState(false)
    const [imageBase64Url, setImageBase64Url] = useState<string | null>(null)
    const dispatch = useDispatch()
    const isCreate = modalDataProp.id === FAKE_ID_FOR_CREATE
    const errors = useRef<{ [key: string]: boolean }>({})
    const getImagePreviewUrl = () => {
        if (imageBase64Url) {
            return imageBase64Url
        }
        if (isCreate) {
            return undefined
        }
        return getMenuBannerImgUrlApi(modalDataProp.id,Math.random())
    }
    const handleSubmit = async () => {
        if (!isModalAllInputValid(inputData, errors)) {
            setToggle(!toggle)
            return
        }
        const isCreate = modalDataProp.id === FAKE_ID_FOR_CREATE
        const targetApi = () => {
            const dto = { ...inputData, type: modalDataProp.type }
            switch (modalDataProp.type) {
                case "series": {
                    if (isCreate) {
                        return createOneApi(EntityName.Series, dto)
                    }
                    return updateOneByIdApi(EntityName.Series, modalDataProp.id, dto)
                }
                case "menu": {
                    if (isCreate) {
                        return createMenuApi(dto)
                    }
                    return updateMenuApi(modalDataProp.id, dto)
                }
                default: {
                    if (isCreate) {
                        return createNavigationApi(dto)
                    }
                    return updateNavigationApi(modalDataProp.id, dto)
                }
            }
        }
        const execute = await targetApi()
        if (execute?.isSuccess) {
            closeModal()
            renderToGetData()
        }
    }
    const handleSetData = (val: string, key: keyof typeof inputData) => {
        const type = typeof inputData[key] as "string" | "number"
        const typedVal = type === "number" ? Number(val) : val
        if (!isInputValid(typedVal, type)) {
            errors.current[key] = true
        } else {
            errors.current[key] = false
        setInputData({ ...inputData, [key]: typedVal })
        }
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
                if (width !== MENU_BANNER_WIDTH ||
                    height !== MENU_BANNER_HEIGHT) {
                    dispatch(setIsLoading(false))
                    dispatchError(`寬須為${MENU_BANNER_WIDTH}px,高須為${MENU_BANNER_HEIGHT}px`)
                    return
                }
                setInputData({ ...inputData, imageFile: uploadedImageFile })
                setImageBase64Url(tempImageBase64Url)
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
                error={errors.current.name}
                value={inputData.name}
                onChange={val => handleSetData(val, "name")}
            />
            <FieldWrapper
                disabled={modalDataProp.type === "series"}
                label="路徑"
                value={inputData.route}
                error={errors.current.route}
                onChange={val => handleSetData(val, "route")}
            />
            <FieldWrapper
                label="排序"
                error={errors.current.order}
                value={inputData.order}
                onChange={val => handleSetData(val, "order")}
            />
            <TextField
                size="small"
                disabled={true}
                label="父元素"
                defaultValue={modalDataProp.parentName}
            />
            {
                modalDataProp.type === "menu" &&
                <Box sx={{ margin: 1, padding: 1 }}>
                    <img
                        style={{
                            width: "100%"
                        }}
                        src={getImagePreviewUrl()}
                        onError={(e) => handleImgError(e)} />
                    <div style={{ textAlign: "center" }}>
                        <IconButton color="primary" component="label">
                            <AddPhotoAlternateIcon />
                            <input hidden accept=".jpg" type="file" onChange={e => handleUploadImg(e)} />
                        </IconButton>
                    </div>
                    <div>上傳圖片 僅限 {MENU_BANNER_WIDTH}px x {MENU_BANNER_HEIGHT}px jpg檔案</div>
                </Box>
            }
            <Button size="small" variant="contained" onClick={() => handleSubmit()}>送出</Button>
        </>
    )
}