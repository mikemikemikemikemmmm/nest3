import { useEffect, useState } from "react"
import { Grid, Button, Stack, Card, TextField, MenuItem, CircularProgress, Box } from "@mui/material";
import { ProductModal, ProductModalDataProp } from "./modal"
import { CREATE_PRODUCT_BY_SERIES_ID_QUERY_STR, FAKE_ID_FOR_CREATE } from "../../const";
import { ModalContainer } from "../../component/modalContainer";
import { GetOneResponse } from "../../api/entityType";
import { EntityName, deleteOneByIdApi, getAllApi } from "../../api/entity";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ProductListItemData, getProductListDataApi } from "@/api/page/productList";
import { checkPositiveInt } from "@/utils/textInput";
import { dispatchError } from "@/utils/errorHandler";
import { ProductListItem } from "./ProductListItem";
const getEmptyProductModalData = (seriesId: number = FAKE_ID_FOR_CREATE, genderId: number = FAKE_ID_FOR_CREATE) => ({
    id: FAKE_ID_FOR_CREATE,
    name: "",
    order: 1,
    genderId,
    seriesId,
    imageFiles: []
})
interface SearchParams {
    name: string,
    seriesId: number,
}
export const ProductListPage = () => {
    const navigate = useNavigate()
    const [URLSearchParams] = useSearchParams();
    const [products, setProducts] = useState<ProductListItemData[]>()
    const [genders, setGenders] = useState<GetOneResponse.Gender[]>()
    const [series, setSeries] = useState<GetOneResponse.Series[]>()
    const [searchResult, setSearchResult] = useState<ProductListItemData[]>()
    const [searchParams, setSearchParams] = useState<SearchParams>({ seriesId: series?.[0].id || 1, name: "" })
    const [toggleToRender, setToggleToRender] = useState(false)
    const [modalDataProp, setModalDataProp] = useState<ProductModalDataProp | undefined>(() => {
        const createBySeriesId = URLSearchParams.get(CREATE_PRODUCT_BY_SERIES_ID_QUERY_STR)
        if (createBySeriesId) {
            if (!checkPositiveInt(createBySeriesId)) {
                dispatchError("series不正確")
                return undefined
            }
            return getEmptyProductModalData(+createBySeriesId, genders?.[0].id)
        }
        return undefined
    })
    const renderToGetNewData = () => {
        setToggleToRender(!toggleToRender)
    }
    const closeModal = () => {
        setModalDataProp(undefined)
    }
    const handleCreate = () => {
        setModalDataProp(getEmptyProductModalData(series?.[0].id, genders?.[0].id))
    }
    const handleEdit = (productModalData: ProductModalDataProp) => {
        setModalDataProp(productModalData)
    }
    const getProducts = async () => {
        const get = await getProductListDataApi()
        if (get?.isSuccess) {
            setProducts(get.data)
            setSearchResult([...get.data])
        }
    }
    const getSeries = async () => {
        const get = await getAllApi<GetOneResponse.Series[]>(EntityName.Series)
        if (get?.isSuccess) {
            setSeries(get.data)
        }
    }
    const getGenders = async () => {
        const get = await getAllApi<GetOneResponse.Gender[]>(EntityName.Gender)
        if (get?.isSuccess) {
            setGenders(get.data)
        }
    }
    const handleDelete = async (id: number) => {
        if (confirm("確定刪除嗎")) {
            const execute = await deleteOneByIdApi(EntityName.Product, id)
            if (execute?.isSuccess) {
                renderToGetNewData()
            }
        }
    }
    const handleSelect = (id: number) => {
        navigate(`/product/${id}`)
    }
    const handleChangeSearchParams = (val: string, key: keyof typeof searchParams) => {
        if (key === "seriesId") {
            setSearchParams({ ...searchParams, seriesId: Number(val) })
        } else {
            setSearchParams({ ...searchParams, name: val })
        }
    }
    const handleSearchProduct = () => {
        const result = products?.filter(p => {
            return p.seriesId === searchParams.seriesId && p.name.includes(searchParams.name)
        })
        setSearchResult(result || [])
    }
    const handleCleanSearch = () => {
        setSearchResult(products ? [...products] : [])
    }
    useEffect(() => {
        getProducts()
    }, [toggleToRender])
    useEffect(() => {
        getSeries()
        getGenders()
    }, [])
    if (!series || !genders || !products) {
        return null
    }
    return (
        <>
            <ModalContainer
                closeFn={closeModal}
                isOpen={modalDataProp !== undefined}>
                <Stack spacing={2}>
                    <ProductModal
                        renderToGetNewData={renderToGetNewData}
                        modalDataProp={modalDataProp as ProductModalDataProp}
                        series={series || []}
                        genders={genders || []}
                        closeModal={closeModal}
                    />
                </Stack>
            </ModalContainer>
            <Grid container spacing={1}>
                <Grid item xs={12} >
                    <Card sx={{ margin: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", padding: 1, justifyContent: "center" }}>
                            <TextField
                                size="small"
                                sx={{ marginX: 1 }}
                                label="名稱"
                                variant="outlined"
                                value={searchParams.name}
                                onChange={e => handleChangeSearchParams(e.target.value, "name")}
                            />
                            <TextField size="small" sx={{ marginX: 1 }}
                                select
                                label="系列"
                                value={searchParams.seriesId}
                                onChange={e => handleChangeSearchParams(e.target.value, "seriesId")}
                            >
                                {series ? series.map((s) => (
                                    <MenuItem key={s.id} value={s.id}>
                                        {s.navigationName}
                                    </MenuItem>
                                )) : []}
                            </TextField>
                        </Box>
                        <Box padding={1} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Button size="small" sx={{ marginX: 1 }} variant="contained" onClick={() => handleSearchProduct()}>搜尋產品</Button>
                            <Button size="small" sx={{ marginX: 1 }} variant="contained" onClick={() => handleCleanSearch()}>清除搜尋</Button>
                            <Button size="small" sx={{ marginX: 1 }} variant="outlined" onClick={() => handleCreate()}>新增產品</Button>
                        </Box>
                    </Card>
                </Grid>

            </Grid>
            {
                searchResult?.map(p =>
                    <Box key={p.id}>
                        <ProductListItem
                            rerender={renderToGetNewData}
                            handleDelete={handleDelete}
                            handleSelect={handleSelect}
                            handleEdit={handleEdit}
                            productListItemData={p}
                        />
                    </Box>
                )
            }

        </>
    )
}