import { Stack, Button, Grid, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { FAKE_ID_FOR_CREATE, FORMDATA_KEY_FOR_FILE } from "../../const";
import { GetOneResponse } from "../../api/entityType";
import { ColorModal, ColorModalData } from "./modal";
import { ColorCard } from "./card";
import { EntityName, deleteOneByIdApi, getAllApi } from "../../api/entity";
import { ModalContainer } from "../../component/modalContainer";
import { dispatchError } from "../../utils/errorHandler";
import { ProductCard } from "../../component/productCard";
import { ResponseProductCard, getColorsBySearchNameApi, getProductCardDataByColorIdApi } from "../../api/page/color";
const getEmptyColorModalData = () => ({ id: FAKE_ID_FOR_CREATE, name: "", imageFile: new File([], FORMDATA_KEY_FOR_FILE) })
export const ColorPage = () => {
    const [colorsData, setColorsData] = useState<GetOneResponse.Color[]>([])
    const [toggleToRender, setToggleToRender] = useState(false)
    const [productCard, setProductCard] = useState<ResponseProductCard[]>([])
    const [modalDataProp, setModalDataProp] = useState<ColorModalData>(() => getEmptyColorModalData())
    const [isModalShow, setIsModalShow] = useState(false)
    const forcedRender = () => {
        setToggleToRender(!toggleToRender)
    }
    const closeModal = () => {
        setModalDataProp(getEmptyColorModalData())
        setIsModalShow(false)
    }
    const handleCreate = () => {
        setModalDataProp(getEmptyColorModalData())
        setIsModalShow(true)
    }
    const handleEdit = (colorModalData: ColorModalData) => {
        setModalDataProp(colorModalData)
        setIsModalShow(true)
    }
    const getColorsData = async (name?: string) => {
        if (name === undefined) {
            const { result, error } = await getAllApi<GetOneResponse.Color[]>(EntityName.Color)
            if (error || !result) {
                return
            }
            setColorsData(result) //TODO
            return
        }
        const { result, error } = await getColorsBySearchNameApi(name)
        if (error || !result) {
            return
        }
        setColorsData(result)
    }
    const renderModal = () => {
        if (isModalShow) {
            return null
        }
        return (
            <ModalContainer closeFn={closeModal} isOpen={true}>
                <Stack spacing={2}>
                    <ColorModal
                        modalDataProp={modalDataProp}
                        forcedRender={forcedRender}
                        closeModal={closeModal}
                    />
                </Stack>
            </ModalContainer>)
    }
    const handleSelect = async (colorId: number) => {
        const { result, error } = await getProductCardDataByColorIdApi(colorId)
        if (error || !result) {
            dispatchError('產生錯誤')
            return
        }
        setProductCard(result)
    }
    const handleDelete = async (id: number) => {
        // e.stopPropagation()
        if (confirm('確定刪除嗎')) {
            const executeDelete = await deleteOneByIdApi(EntityName.Color, id)
            if (!executeDelete.error) {
                forcedRender()
            }
        }
    }
    useEffect(() => {
        getColorsData()
    }, [toggleToRender])
    return (
        <>
            {
                renderModal()
            }
            <Container>
                <Grid container sx={{ margin: 1 }} spacing={2}>
                    <Grid item md={2} sm={4} xs={6}>
                        <Button sx={{ height: '100%' }} variant="contained" fullWidth onClick={() => handleCreate()}>新增顏色</Button>
                    </Grid>
                    <Grid item md={10} sm={8} xs={6}>
                    </Grid>
                    {
                        colorsData.map(c => <ColorCard
                            handleEdit={handleEdit}
                            handleSelect={handleSelect}
                            handleDelete={handleDelete}
                            key={c.id}
                            colorData={c} />)
                    }
                </Grid>
                <Grid container sx={{ margin: 1 }} spacing={2}>
                    <Grid item xs={12}>
                        <Button variant="contained" onClick={() => setProductCard([])}>
                            清空產品資料
                        </Button>
                    </Grid>
                    {productCard.length === 0 ?
                        <Grid item xs={12} >無產品資料</Grid>
                        :
                        productCard.map(pc => (
                            <Grid item xs={2} key={pc.id} >
                                <ProductCard id={pc.id} text={pc.name} firstSubProductId={pc.firstSubProductId} />
                            </Grid>)
                        )
                    }
                </Grid>
            </Container>
        </>
    )
}