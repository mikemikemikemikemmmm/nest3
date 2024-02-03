import { useState } from "react";
import { FAKE_ID_FOR_CREATE } from "../../const";
import { createOneApi, updateOneByIdApi } from "../../api/entity";
import { NavigationTreeItem } from "../../api/page/navigation";

export interface NavigationModalData extends Omit<NavigationTreeItem, 'children'> { }
export const NavigationModal = (props: {
    modalDataProp: NavigationModalData,
    closeModal: () => void,
}) => {
    const { modalDataProp, closeModal } = props
    const [modalData, setModalData] = useState<NavigationModalData>(modalDataProp)
    const handleSubmit = async () => {
        const isCreate = modalDataProp.id === FAKE_ID_FOR_CREATE
        const targetApi = () => {
            if (isCreate) {
                return createOneApi(modalData.type, modalData)
            }
            return updateOneByIdApi(modalData.type, modalData.id, modalData)
        }
        const execute = await targetApi()
        const { result, error } = execute
        if (error || !result) {
            //TODO

        }
    }
    return (
        <>
            werwerew//TODO
            {/* <TextField
                sx={{ color: 'black' }}
                label="名稱"
                onBlur={() => setNameHasFocused(true)}
                error={modalData.text === '' && nameHasFocused}
                variant="outlined"
                defaultValue={modalData.text}
                onChange={(e) => handleChangeName(e)} />
            <TextField
                sx={{ color: 'black' }}
                label="排序"
                onBlur={() => setNameHasFocused(true)}
                error={modalData.order === '' && nameHasFocused}
                variant="outlined"
                defaultValue={modalData.order}
                onChange={(e) => handleChangeName(e)} />
            <TextField
                sx={{ color: 'black' }}
                label="父元素"
                onBlur={() => setNameHasFocused(true)}
                error={modalData.parentId === FAKE_ID_FOR_CREATE}
                variant="outlined"
                defaultValue={modalData.parentId}
                onChange={(e) => handleChangeName(e)} />
            <Button variant="contained" onClick={() => handleSubmit()}>送出</Button> */}
        </>
    )
}