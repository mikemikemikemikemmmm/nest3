import { Card, Container, Button, Box, Stack, Grid } from "@mui/material";
import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { FAKE_ID_FOR_CREATE, KEY_FOR_UPLOAD_IMAGE_FORM_DATA } from "../../const";
import { EntityName, deleteOneByIdApi, getAllApi, getOneByIdApi } from "../../api/entity";
import { GetOneResponse } from "../../api/entityType";
import { SubProductCard } from "./subProductCard";
import { SubProductModal, SubProductModalDataProp } from "./subProductModal";
import { ModalContainer } from "../../component/modalContainer";
import { getProductImgUrlApi } from "@/api/staticFile";
import { handleImgError } from "@/utils/imgError";
import { ProductModalDataProp } from "../productList/modal";
const createEmptySubProductData = (productId: number, color: GetOneResponse.Color): SubProductModalDataProp => ({
    id: FAKE_ID_FOR_CREATE,
    colorId: color.id,
    productId,
    price: 1,
    order: 1,
    imageFile: new File([], KEY_FOR_UPLOAD_IMAGE_FORM_DATA),
    sizeIdList: []
})
export const ProductDetailPage = () => {
    const { productId } = useParams()
    const navigate = useNavigate()
    if (!productId) {
        navigate("/")
    }
    const numberProductId = Number(productId)
    const [subproductModalDataProp, setSubproductModalDataProp] = useState<SubProductModalDataProp | undefined>(undefined)
    const [product, setProduct] = useState<GetOneResponse.Product>()
    const [sizes, setSizes] = useState<GetOneResponse.Size[]>()
    const [subProducts, setSubProducts] = useState<GetOneResponse.SubProduct[]>()
    const [colors, setColors] = useState<GetOneResponse.Color[]>()
    const [toggleToRender, setToggleToRender] = useState(false)
    const getColors = async () => {
        const result = await getAllApi<GetOneResponse.Color[]>(EntityName.Color)
        if (result?.isSuccess) {
            setColors(result.data)
        }
    }
    const getSizes = async () => {
        const result = await getAllApi<GetOneResponse.Size[]>(EntityName.Size)
        if (result?.isSuccess) {
            setSizes(result.data)
        }
    }
    const getProduct = async () => {
        const result = await getOneByIdApi<GetOneResponse.Product>(EntityName.Product, numberProductId)
        if (result?.isSuccess && result.data) {
            setProduct(result.data)
        } else {
            navigate("/")
        }
    }
    const getSubproducts = async () => {
        const result = await getAllApi<GetOneResponse.SubProduct[]>(EntityName.SubProduct, { productId: productId as string })
        if (result?.isSuccess) {
            setSubProducts(result.data)
        }
    }
    const getAll = async () => {
        const apis = [getColors(), getProduct(), getSizes()]
        await Promise.all(apis)
    }
    useEffect(() => {
        getAll()
    }, [])
    useEffect(() => {
        getSubproducts()
    }, [toggleToRender])
    if (!subProducts || !product || !colors || !sizes) {
        return null
    }
    const closeModal = () => {
        setSubproductModalDataProp(undefined)
    }
    const handleCreateSubProduct = () => {
        const targetColor = colors?.[0] as GetOneResponse.Color
        setSubproductModalDataProp(createEmptySubProductData(numberProductId, targetColor))
    }
    const handleDeleteSubproduct = async (subproductId: number) => {
        if (confirm("確定刪除嗎")) {
            const execute = await deleteOneByIdApi(EntityName.SubProduct, subproductId)
            if (execute?.isSuccess) {
                renderToGetNewData()
            }
        }
    }
    const handleDeleteProduct = async () => {
        if (confirm("確定刪除嗎")) {
            const execute = await deleteOneByIdApi(EntityName.Product, numberProductId)
            if (execute?.isSuccess) {
                navigate("/productList")
            }
        }
    }
    const handleEditSubproduct = (subproductData: GetOneResponse.SubProduct) => {
        setSubproductModalDataProp(subproductData)
    }
    const renderToGetNewData = () => {
        setToggleToRender(!toggleToRender)
    }
    const renderProductImage = () => {
        const { imageFileNameListStringifyJson } = product
        const domList = [] as JSX.Element[]
        const imgFileList: string[] = JSON.parse(imageFileNameListStringifyJson)
        imgFileList.forEach(imageName => {
            const imgGrid = (
                <Grid item sm={2} xs={4} key={imageName} >
                    <img
                        width={"100%"}
                        onError={(e) => handleImgError(e)}
                        src={getProductImgUrlApi(product.id, imageName)} />
                </Grid>)
            domList.push(imgGrid)
        })
        return domList
    }
    if (!subProducts || !product || !colors || !sizes) {
        return null
    }
    return (
        <Container>
            <ModalContainer closeFn={closeModal} isOpen={subproductModalDataProp !== undefined}>
                <Stack spacing={2}>
                    <SubProductModal
                        modalDataProp={subproductModalDataProp as SubProductModalDataProp}
                        closeModal={closeModal}
                        subProducts={subProducts || []}
                        sizes={sizes || []}
                        colors={colors || []}
                        renderToGetNewData={renderToGetNewData}
                    />
                </Stack>
            </ModalContainer>
            <Card sx={{ marginBottom: 2, padding: 1 }}>
                <Box margin={1} display={"flex"}>
                    名稱：{product?.name}-{product?.genderName}
                    <Button
                        variant="outlined"
                        style={{ marginLeft: "auto" }}
                        onClick={() => handleCreateSubProduct()}
                    >
                        新增副產品
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ marginLeft: 1 }}
                        onClick={() => handleDeleteProduct()}
                    >
                        刪除產品
                    </Button>
                    {/* <Button
                        variant="contained"
                        sx={{ marginLeft: 1 }}
                        onClick={() => handleDeleteProduct()}
                    >
                        修改產品
                    </Button> */}
                </Box>
                <Box margin={1}>排序：{product?.order}</Box>
                <Box margin={1}>種類：{product?.navigationName}</Box>
                <Box margin={1}>
                    <Grid container spacing={1}>
                        {
                            renderProductImage()
                        }
                    </Grid></Box>
            </Card>
            <Grid container spacing={2}>
                {
                    (subProducts === undefined || subProducts.length === 0) ?
                        <Grid item xs={12} sx={{ margin: 1, textAlign: 'center', fontSize: 30 }}>
                            沒有副產品
                        </Grid>
                        :
                        subProducts.map(sp => (
                            <Grid item lg={4} md={6} xs={12} key={sp.id} >
                                <SubProductCard
                                    subProductData={sp}
                                    handleEdit={handleEditSubproduct}
                                    handleDelete={handleDeleteSubproduct}
                                />
                            </Grid>
                        ))
                }
            </Grid>
        </Container>
    )
}