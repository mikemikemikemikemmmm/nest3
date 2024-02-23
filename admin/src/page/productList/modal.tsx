import { CreateDto, GetOneResponse, UpdateDto } from "../../api/entityType"
import { useRef, useState } from "react"
import { FAKE_ID_FOR_CREATE } from "../../const"
import { dispatchError } from "../../utils/errorHandler"
import { EntityName, createOneApi, updateOneByIdApi } from "../../api/entity"
import { Box, Button, Fab, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import { FieldWrapper } from "../../component/fieldWrapper"
import { isInputValid, isModalAllInputValid } from "@/utils/textInput"

export interface ProductModalDataProp extends CreateDto.Product {
    "id": number
}
export const ProductModal = (props: {
    modalDataProp: ProductModalDataProp,
    series: GetOneResponse.Series[],
    genders: GetOneResponse.Gender[]
    closeModal: () => void,
    renderToGetNewData: () => void
}) => {
    const { modalDataProp, renderToGetNewData, closeModal, series, genders } = props
    const [inputData, setInputData] = useState<CreateDto.Product>({
        name: modalDataProp.name,
        order: modalDataProp.order,
        genderId: modalDataProp.genderId,
        seriesId: modalDataProp.seriesId,
        imageFiles: modalDataProp.imageFiles
    })
    const [toggle, setToggle] = useState(false)
    const errors = useRef<{ [key: string]: boolean }>({})
    const setImageFile = (file:File,imageIndex:number)=>{
        const newFilesList = [...inputData.imageFiles]
        newFilesList[imageIndex] = file
        setInputData({...inputData,imageFiles:newFilesList})
    }
    const createNewImageFile= (file:File)=>{
        const newFilesList = [...inputData.imageFiles,file]
        setInputData({...inputData,imageFiles:newFilesList})
    }
    const handleSubmit = async () => {
        if (!isModalAllInputValid(inputData, errors)) {
            setToggle(!toggle)
            return
        }
        const isCreate = modalDataProp.id === FAKE_ID_FOR_CREATE
        if (isCreate) {
            const execute =
                await createOneApi(EntityName.Product, inputData)
            if (execute?.isSuccess) {
                closeModal()
                renderToGetNewData()
            }
            return
        }
        const execute =
            await updateOneByIdApi(EntityName.Product, modalDataProp.id, inputData)
        if (execute?.isSuccess) {
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
        }
        setInputData({ ...inputData, [key]: typedVal })
    }
    return (
        <>
            <FieldWrapper
                label="名稱"
                defaultValue={inputData.name}
                error={errors.current.name}
                onChange={val => handleSetData(val, "name")}
            />
            <FieldWrapper
                label="排序"
                defaultValue={inputData.order}
                error={errors.current.order}
                onChange={val => handleSetData(val, "order")}
            />
            <FormControl
                size="small"
                fullWidth>
                <InputLabel>性別</InputLabel>
                <Select
                    value={inputData.genderId}
                    label="性別"
                    defaultValue={inputData.genderId}
                    onChange={e => handleSetData(e.target.value as string, "genderId")}
                >
                    {
                        genders.map(g =>
                            <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
            <FormControl
                size="small"
                fullWidth>
                <InputLabel>系列</InputLabel>
                <Select
                    value={inputData.seriesId}
                    label="系列"
                    defaultValue={inputData.seriesId}
                    onChange={e => handleSetData(e.target.value as string, "seriesId")}
                >
                    {
                        series.map(s =>
                            <MenuItem key={s.id} value={s.id}>{s.navigationName}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
            <Button variant="contained" onClick={() => handleSubmit()}>送出</Button>
        </>
    )
}