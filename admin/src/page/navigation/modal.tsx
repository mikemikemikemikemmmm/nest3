import { useRef, useState } from "react";
import { NavigationTreeItem, createNavigationApi, updateNavigationApi } from "../../api/page/navigation";
import { Button, TextField } from "@mui/material";
import { FieldWrapper } from "../../component/fieldWrapper";
import { isInputValid, isModalAllInputValid } from "@/utils/textInput";
import { EntityName, createOneApi, updateOneByIdApi } from "@/api/entity";
import { FAKE_ID_FOR_CREATE } from "@/const";
import { CreateDto } from "@/api/entityType";
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
        route: modalDataProp.type === "series"?"該元素無路徑":modalDataProp.route,
        type:modalDataProp.type
    })
    const [toggle, setToggle] = useState(false)
    const errors = useRef<{ [key: string]: boolean }>({})
    const handleSubmit = async () => {
        if (!isModalAllInputValid(inputData, errors)) {
            setToggle(!toggle)
            return
        }
        const isCreate = modalDataProp.id === FAKE_ID_FOR_CREATE
        const isSeries = modalDataProp.type === "series"
        const targetApi = () => {
            const dto = { ...inputData, type: modalDataProp.type }
            if (isSeries) {
                if (isCreate) {
                    return createOneApi(EntityName.Series, dto)
                }
                return updateOneByIdApi(EntityName.Series, modalDataProp.id, dto)
            }
            if (isCreate) {
                return createNavigationApi(dto)
            }
            return updateNavigationApi(modalDataProp.id, dto)
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
        }
        setInputData({ ...inputData, [key]: typedVal })
    }
    return (
        <>
            <FieldWrapper
                label="名稱"
                error={errors.current.name}
                defaultValue={inputData.name}
                onChange={val => handleSetData(val, "name")}
            />
            <FieldWrapper
                disabled={modalDataProp.type === "series"}
                label="路徑"
                defaultValue={inputData.route}
                error={errors.current.route}
                onChange={val => handleSetData(val, "route")}
            />
            <FieldWrapper
                label="排序"
                error={errors.current.order}
                defaultValue={inputData.order}
                onChange={val => handleSetData(val, "order")}
            />
            <TextField
                size="small"
                disabled={true}
                label="父元素"
                defaultValue={modalDataProp.parentName}
            />
            <Button size="small" variant="contained" onClick={() => handleSubmit()}>送出</Button>
        </>
    )
}