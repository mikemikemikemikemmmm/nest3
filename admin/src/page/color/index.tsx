import { Stack, Button, Grid, Container, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { FAKE_ID_FOR_CREATE, KEY_FOR_UPLOAD_IMAGE_FORM_DATA } from "../../const";
import { GetOneResponse } from "../../api/entityType";
import { ColorModal, ColorModalData } from "./modal";
import { ColorCard } from "./colorCard";
import { EntityName, deleteOneByIdApi, getAllApi } from "../../api/entity";
import { ModalContainer } from "../../component/modalContainer";
import { ProductCard } from "../../component/productCard";
import { getProductCardsApi } from "../../api/common";
const createEmptyColorModalData = () => ({
    id: FAKE_ID_FOR_CREATE,
    name: "",
    imageFile: new File([], KEY_FOR_UPLOAD_IMAGE_FORM_DATA)
})
export const ColorPage = () => {
    const [colors, setColors] = useState<GetOneResponse.Color[]>()
    const [productCards, setProductCards] = useState<GetOneResponse.ProductCard[]>([])
    const [modalDataProp, setModalDataProp] = useState<ColorModalData | undefined>(undefined)
    const [toggleToRender, setToggleToRender] = useState(false)
    const handleSelect = async (colorId: number) => {
        const response = await getProductCardsApi({ colorId: String(colorId) })
        if (response.isSuccess) {
            setProductCards(response.data)
        }
    }
    const getColorsData = async () => {
        const colorsResponse = await getAllApi<GetOneResponse.Color[]>(EntityName.Color)
        if (colorsResponse.isSuccess) {
            setColors(colorsResponse.data)
            return
        }
    }
    useEffect(() => {
        getColorsData()
    }, [toggleToRender])
    const forcedRender = () => {
        setToggleToRender(!toggleToRender)
    }
    const closeModal = () => {
        setModalDataProp(undefined)
    }
    const handleCreate = () => {
        setModalDataProp(createEmptyColorModalData())
    }
    const handleEdit = (colorModalData: ColorModalData) => {
        setModalDataProp(colorModalData)
    }
    const handleDelete = async (id: number) => {
        if (confirm('確定刪除嗎')) {
            const executeDelete = await deleteOneByIdApi(EntityName.Color, id)
            if (executeDelete?.isSuccess) {
                forcedRender()
            }
        }
    }
    if (!colors) {
        return null
    }
    return (
        <>
            <ModalContainer closeFn={closeModal} isOpen={modalDataProp !== undefined}>
                <Stack spacing={2}>
                    <ColorModal
                        colorsData={colors || []}
                        modalDataProp={modalDataProp as ColorModalData}
                        forcedRender={forcedRender}
                        closeModal={closeModal}
                    />
                </Stack>
            </ModalContainer>
            <Grid container sx={{ margin: 1 }} spacing={2}>
                <Grid item md={2} sm={4} xs={6}>
                    <Button sx={{ height: '100%' }} variant="contained" fullWidth onClick={() => handleCreate()}>新增顏色</Button>
                </Grid>
                <Grid item md={10} sm={8} xs={6}>
                </Grid>
                {
                    (!colors || colors.length === 0) ?
                        <Grid item xs={12} >無顏色</Grid>
                        :
                        colors.map(c => <ColorCard
                            handleEdit={handleEdit}
                            handleSelect={handleSelect}
                            handleDelete={handleDelete}
                            key={c.id}
                            colorData={c} />)
                }
            </Grid>
            <Grid container sx={{ margin: 1 }} spacing={2}>
                <Grid item xs={12}>
                    <Button variant="contained" onClick={() => setProductCards([])}>
                        清空產品資料
                    </Button>
                </Grid>
                {productCards.length === 0 ?
                    <Grid item xs={12} >無產品資料</Grid>
                    :
                    productCards.map(pc => (
                        <Grid item xs={2} key={pc.id} >
                            <ProductCard productCardData={pc} />
                        </Grid>)
                    )
                }
            </Grid>
        </>
    )
}