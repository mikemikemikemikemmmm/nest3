import { useRef, useState } from "react"
import { CreateDto, GetOneResponse, UpdateDto } from "../../api/entityType"
import { FAKE_ID_FOR_CREATE, SUB_PRODUCT_IMG_HEIGHT, SUB_PRODUCT_IMG_WIDTH, SUB_PRODUCT_MODAL_IMG_DOM_ID } from "../../const"
import { dispatchError } from "../../utils/errorHandler"
import { setIsLoading } from "../../store"
import { getImgUrlBySubProductIdApi } from "../../api/staticFile"
import { useDispatch } from "react-redux"
import { handleImgError } from "../../utils/imgError"
import { Box, Button, Chip, FormControl, IconButton, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField } from "@mui/material"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { isInputValid, isModalAllInputValid } from "@/utils/textInput"
import { FieldWrapper } from "@/component/fieldWrapper"
import { createSubProductAPi, updateSubProductApi } from "@/api/page/productDetail"

export interface SubProductModalDataProp extends CreateDto.SubProduct {
    id: number
    imageFile: File
}
interface Props {
    modalDataProp: SubProductModalDataProp,
    colors: GetOneResponse.Color[]
    sizes: GetOneResponse.Size[],
    subProducts: GetOneResponse.SubProduct[],
    closeModal: () => void,
    renderToGetNewData: () => void
}
const inputSX = { margin: 1, display: "block", width: 100 }
export const SubProductModal = (props: Props) => {
    const dispatch = useDispatch()
    const { modalDataProp, closeModal, renderToGetNewData, colors, sizes, subProducts } = props
    const isCreate = modalDataProp.id === FAKE_ID_FOR_CREATE
    const [inputData, setInputData] = useState<CreateDto.SubProduct>({
        price: modalDataProp.price,
        order: modalDataProp.order,
        colorId: modalDataProp.colorId,
        productId: modalDataProp.productId,
        sizeIdList: modalDataProp.sizeIdList,
        imageFile: modalDataProp.imageFile
    })
    const [imageBase64Url, setImageBase64Url] = useState<string | null>(null)
    const [toggle, setToggle] = useState(false)
    const errors = useRef<{ [key: string]: boolean }>({})
    const hasSameColorId = () => {
        return subProducts.some(sp => {
            if (sp.colorId === inputData.colorId && sp.id !== modalDataProp.id) {
                return true
            }
        })
    }
    const handleSubmit = async () => {
        if (hasSameColorId()) {
            dispatchError("有同樣顏色的產品")
            return
        }
        if (!isModalAllInputValid(inputData, errors)) {
            setToggle(!toggle)
            return
        }
        let executeApi
        if (isCreate) {
            if (!inputData.imageFile) {
                dispatchError('圖片為必須')
                return
            }
            executeApi =
                await createSubProductAPi(inputData)
        } else {
            executeApi =
                await updateSubProductApi(inputData, modalDataProp.id)
        }
        if (executeApi?.isSuccess) {
            closeModal()
            renderToGetNewData()
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
        dispatch(setIsLoading(true))
        const uploadedImageFile = e.target.files?.[0]
        if (!uploadedImageFile) {
            dispatchError('上傳圖片失敗')
            return
        }
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
                setInputData({ ...inputData, imageFile: uploadedImageFile })
                setImageBase64Url(tempImageBase64Url)
                dispatch(setIsLoading(false))
            }
            tempImageDom.src = tempImageBase64Url
        };
        fileReader.readAsDataURL(uploadedImageFile);
    }
    const handleChangeSizeId = (event: SelectChangeEvent<number[]>) => {
        const {
            target: { value },
        } = event;
        setInputData({
            ...inputData,
            sizeIdList: value as number[]
        })
    };
    return (
        <>
            <div style={{ display: "flex" }}>
                <Box sx={{ display: "flex", flexDirection: "column", margin: 1, padding: 1, justifyContent: 'center' }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img
                            id={SUB_PRODUCT_MODAL_IMG_DOM_ID}
                            style={{
                                width: imageBase64Url ? SUB_PRODUCT_IMG_WIDTH / 3 : 0,
                                height: imageBase64Url ? SUB_PRODUCT_IMG_WIDTH / 3 : 0
                            }}
                            src={getImagePreviewUrl()}
                            onError={(e) => handleImgError(e)} />
                    </div>
                    <div style={{ textAlign: "center" }}>
                        <IconButton color="primary" component="label">
                            <AddPhotoAlternateIcon />
                            <input hidden accept=".jpg" type="file" onChange={e => handleUploadImg(e)} />
                        </IconButton>
                    </div>
                    <Box margin={0.5}>上傳圖片</Box>
                    <Box margin={0.5}>{`僅限 ${SUB_PRODUCT_IMG_WIDTH}px x ${SUB_PRODUCT_IMG_HEIGHT}px`}</Box>
                    <Box margin={0.5}>.jpg檔案</Box>
                </Box>
                <span style={{ flexGrow: 1 }}>
                    <TextField size="small"
                        sx={inputSX}
                        select
                        label="顏色"
                        value={inputData.colorId}
                        onChange={e => handleSetData(e.target.value, "colorId")}
                    >
                        {colors?.map((c) => (
                            <MenuItem key={c.id} value={c.id}>
                                {c.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <FieldWrapper
                        sx={inputSX}
                        label="價格"
                        error={errors.current.price}
                        value={inputData.price}
                        onChange={val => handleSetData(val, "price")}
                    />
                    <FieldWrapper
                        sx={inputSX}
                        label="排序"
                        error={errors.current.order}
                        value={inputData.order}
                        onChange={val => handleSetData(val, "order")}
                    />
                    <FormControl sx={inputSX}>
                        <InputLabel id="size-label">尺寸</InputLabel>
                        <Select
                            labelId="size-label"
                            multiple
                            //@ts-ignore
                            value={inputData.sizeIdList}
                            onChange={handleChangeSizeId}
                            input={<OutlinedInput label="尺寸" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {inputData.sizeIdList.map((sizeId) => (
                                        <Chip
                                            key={sizeId}
                                            label={sizes.find(s => s.id === sizeId)?.name || sizeId}
                                        />
                                    ))}
                                </Box>
                            )}
                        >
                            {
                                sizes.map(s => (
                                    <MenuItem
                                        key={s.id}
                                        value={s.id}
                                    >
                                        {s.name}
                                    </MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                </span>
            </div >
            <Button variant="contained" onClick={() => handleSubmit()}>送出</Button>
        </>
    )
}