import { useEffect, useState } from "react"
import { Container, Grid, Button, TextField, Stack, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { ProductModal, ProductModalData } from "./modal"
import { FAKE_ID_FOR_CREATE } from "../../const";
import { ModalContainer } from "../../component/modalContainer";
const getEmptyProductModalData = () => ({
    id: FAKE_ID_FOR_CREATE,
    name: "",
    order: 0,
    genderId: FAKE_ID_FOR_CREATE,
    seriesId: FAKE_ID_FOR_CREATE
})

export const ProductListPage = () => {
    const [modalDataProp, setModalDataProp] = useState<ProductModalData>(() => getEmptyProductModalData())
    const [productsData, setProductsData] = useState<ResProductCard[]>([])
    const [seriesData, setSeriesData] = useState<ResSeriesForDetailPage[]>([])
    const [toggleToRender, setToggleToRender] = useState(false)
    const [isModalShow, setIsModalShow] = useState(false)
    const forcedRender = () => {
        setToggleToRender(!toggleToRender)
    }
    const closeModal = () => {
        setModalDataProp(() => getEmptyProductModalData())
        setIsModalShow(false)
    }
    const handleCreate = () => {
        setModalDataProp(() => getEmptyProductModalData())
        setIsModalShow(true)
    }
    const handleEdit = (productModalData: ProductModalData) => {
        setModalDataProp(productModalData)
        setIsModalShow(true)
    }
    const getProductsAndSeriesOnProductPage = async () => {
        const getSeries = await getSeriesDataForCreateProductApi()
        const getProducts = await getProductsForProductPageApi()
        if (getProducts.error || getSeries.error || !getProducts.result || !getSeries.result) {
            return
        }
        setProductsData(getProducts.result)
        setSeriesData(getSeries.result)
    }
    const handleToggle = () => {
        setToggleToRender(!toggleToRender)
    }
    const renderModal = () => {
        if (!isModalShow) {
            return null
        }
        return <ModalContainer
            closeFn={closeModal}
            isOpen={true}>
            <Stack spacing={2}>
                <ProductModal
                    modalDataProp={modalDataProp}
                    seriesData={seriesData}
                    closeModal={closeModal}
                    toggle={handleToggle}
                />
            </Stack>
        </ModalContainer>
    }
    useEffect(() => {
        getProductsAndSeriesOnProductPage()
    }, [toggleToRender])
    return (
        <>
            {
                renderModal()
            }
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={2}>
                        <Button sx={{ height: '100%' }} variant="contained" fullWidth onClick={() => handleCreate()}>新增產品</Button>
                    </Grid>
                    <Grid item xs={10}  >
                    </Grid>
                    {productsData.map(p => (
                        <Grid key={p.id} item lg={2} md={3} sm={6} xs={12}>
                            <ProductCard key={p.id} id={p.id} name={p.name} first_subproduct_id={p.first_subproduct_id} />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    )
}