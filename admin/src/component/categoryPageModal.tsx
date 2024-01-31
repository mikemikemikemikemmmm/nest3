import { Button, TextField } from '@mui/material'
import React, { useState } from 'react'
import { NavType } from '../page/category'
import { dispatchError } from '../utils/errorHandler'
import { isNumInt } from '../utils/isPostiveInt'
import { EntityName, updateOneByIdApi } from '../api/entity'
import { UpdateDto } from '../api/entityType'
interface InputData {
    name: string,
    route: string,
    sort: number,
    parent_id: number,
}
export type ModalData = {
    id: number,
    name: string,
    sort: number,
    route?: string
}
interface Props {
    type: NavType
    modalData?: ModalData,
    parentId?: number
    closeModalFn: () => void,
    toggleToRenderFn: () => void,
}
export const CategoryPageModal = (props: Props) => {
    const { type, modalData, parentId = -1, closeModalFn, toggleToRenderFn } = props
    const isPut = modalData
    const id = modalData?.id || -1
    const initInputData = () => {
        let _data = {
            name: "",
            route: '',
            sort: 0,
            parent_id: parentId
        } as InputData
        if (isPut) {
            _data.name = modalData.name
            _data.route = modalData.route as string
            _data.sort = modalData.sort
        }
        return _data
    }
    const [inputHasFocused, setInputHasfocused] = useState({
        name: false,
        route: false
    })
    const [inputData, setInputData] = useState<InputData>(() => initInputData())
    const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, key: keyof InputData, type: 'string' | 'number' = 'string') => {
        let _value: number | string = e.target.value
        if (type === 'number') {
            _value = Number(_value)
            if (isNaN(_value)) {
                return
            }
        }
        setInputData({ ...inputData, [key]: _value })
    }
    const isInputValidPass = () => {
        const name = inputData.name !== ''
        const sort = isNumInt(inputData.sort)
        const route = type === 'series' ? true : inputData.route !== ''
        return name && sort && route
    }
    const handleCreate = async () => {  //TODO
        const targetApi = (() => {
            switch (type) {
                case 'nav':
                    return updateOneByIdApi<UpdateDto.Nav>(
                        EntityName.Nav,
                        id,
                        {
                            text: inputData.name,
                            order: inputData.sort,
                            route: inputData.route
                        })
                case 'category':
                    return putCategoryApi({
                        id,
                        name: inputData.name,
                        sort: inputData.sort,
                        route: inputData.route, nav_id: inputData.parent_id

                    })
                case 'subCategory':
                    return putSubCategoryApi({
                        id,
                        name: inputData.name,
                        sort: inputData.sort,
                        route: inputData.route,
                        category_id: inputData.parent_id

                    })
                case 'series':
                    return putSeriesApi({
                        id,
                        name: inputData.name,
                        sort: inputData.sort,
                        sub_category_id: inputData.parent_id
                    })
            }
        })()
        const response = await targetApi()
        if (response.error) {
            dispatchError(response.error)
        } else {
            closeModalFn()
            toggleToRenderFn()
        }
    }
    const handleUpdate = async () => {
        const targetApi = (() => {
            switch (type) {
                case 'nav':
                    return updateOneByIdApi<UpdateDto.Nav>(
                        EntityName.Nav,
                        id,
                        {
                            text: inputData.name,
                            order: inputData.sort,
                            route: inputData.route
                        })
                case 'category':
                    return putCategoryApi({
                        id,
                        name: inputData.name,
                        sort: inputData.sort,
                        route: inputData.route, nav_id: inputData.parent_id

                    })
                case 'subCategory':
                    return putSubCategoryApi({
                        id,
                        name: inputData.name,
                        sort: inputData.sort,
                        route: inputData.route,
                        category_id: inputData.parent_id

                    })
                case 'series':
                    return putSeriesApi({
                        id,
                        name: inputData.name,
                        sort: inputData.sort,
                        sub_category_id: inputData.parent_id
                    })
            }
        })()
        const response = await targetApi()
        if (response.error) {
            dispatchError(response.error)
        } else {
            closeModalFn()
            toggleToRenderFn()
        }
    }
    const handleSubmit = () => {
        setInputHasfocused({ name: true, route: true })
        if (!isInputValidPass()) {
            dispatchError('名字跟網址為必須，排序須為正整數')
            return
        }
        if (isPut){
            handleUpdate()
        }else{
            handleCreate()
        }
    }

    return (
        <>
            <TextField label="名稱"
                size='small'
                onBlur={() => setInputHasfocused({ ...inputHasFocused, name: true })}
                error={inputData.name === '' && inputHasFocused.name}
                variant="outlined"
                value={inputData.name}
                onChange={(e) => handleChangeInput(e, 'name')}
            />
            <TextField size='small' type="number" label="排序" error={!isNumInt(inputData.sort)} variant="outlined" value={inputData.sort} onChange={(e) => handleChangeInput(e, 'sort', 'number')} />
            {
                type !== 'series' &&
                <TextField label="網址" size='small'
                    onBlur={() => setInputHasfocused({ ...inputHasFocused, route: true })}
                    error={inputData.route === '' && inputHasFocused.route}
                    variant="outlined" value={inputData.route}
                    onChange={(e) => handleChangeInput(e, 'route')}
                />
            }
            <Button variant="contained" onClick={handleSubmit}>送出</Button>
        </>
    )
}