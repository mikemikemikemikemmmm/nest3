import { useEffect, useState } from "react"
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { CREATE_PRODUCT_BY_SERIES_ID_QUERY_STR, DRAWER_WIDTH, FAKE_ID_FOR_CREATE } from "../../const"
import { NavigationItem } from "./navigationItem"
import { ModalContainer } from "../../component/modalContainer"
import { Box, Button, Card, CircularProgress, Divider, Grid, IconButton, Stack } from "@mui/material"
import { NavigationModal, NavigationModalDataProp } from "./modal"
import { NavigationTreeItem, SeriesTreeItem, deleteNavigationApi, getNavigationTreeApi, getSeriesTreeBySubCategoryIdApi } from "../../api/page/navigation"
import { NavigationTreeItemType } from "../../api/entityType"
import { ProductCard } from "../../component/productCard"
import { EntityName, deleteOneByIdApi } from "../../api/entity";
import { useNavigate, useSearchParams } from "react-router-dom";
const getEmptyModalData = (type: NavigationTreeItemType, parentId: number) => ({
    id: FAKE_ID_FOR_CREATE,
    name: "",
    order: 1,
    route: "",
    type,
    parentId,
    parentName: ""
}) as NavigationModalDataProp
export const NavigationPage = () => {
    const navigateFn = useNavigate()
    const [navigationTreeData, setNavigationTreeData] = useState<NavigationTreeItem[]>()
    const [selectedMenu, setSelectedMenu] = useState<NavigationTreeItem>()
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number>()
    const [seriesTreeData, setSeriesTreeData] = useState<SeriesTreeItem[]>([])
    const [modalDataProp, setModalDataProp] = useState<NavigationModalDataProp | undefined>(undefined)
    const [toggleToRender, setToggleToRender] = useState(false)
    const isModalShow = modalDataProp !== undefined
    const getParentName = (selfType: NavigationTreeItemType, parentId: number) => {
        if (selfType === "menu") {
            return ""
        }
        else if (selfType === "category") {
            return selectedMenu?.name || ""
        }
        else if (selfType === "subCategory") {
            const parentCategory = selectedMenu?.children.find(c => c.id === parentId)
            if (!parentCategory) {
                return ""
            }
            return `${selectedMenu?.name}-${parentCategory?.name}`
        } else {
            const categoryList = (selectedMenu as NavigationTreeItem).children
            let selectedSubcategory = selectedMenu //temp fake
            const selectedCategory = categoryList.find(c => {
                selectedSubcategory = c.children.find(sc => sc.id === selectedSubCategoryId) as NavigationTreeItem
                return !!selectedSubcategory
            })
            if (!selectedSubcategory) {
                return `${selectedMenu?.name}-${selectedCategory?.name}`
            }
            return `${selectedMenu?.name}-${selectedCategory?.name}-${selectedSubcategory?.name}`

        }
    }
    const handleEdit = (treeItem: NavigationTreeItem) => {
        setModalDataProp({
            ...treeItem,
            parentName: getParentName(treeItem.type, treeItem.parentId)
        })
    }
    const handleCreate = (type: NavigationTreeItemType, parentId: number) => {
        setModalDataProp({
            ...getEmptyModalData(type, parentId),
            parentName: getParentName(type, parentId)
        })
    }
    const renderToGetData = () => {
        setToggleToRender(!toggleToRender)
    }
    const closeModal = () => {
        setModalDataProp(undefined)
    }
    const handleDelete = async (id: number, type: NavigationTreeItemType) => {
        if (confirm('確定刪除嗎')) {
            const targetApi = (() => {
                if (type === "series") {
                    return deleteOneByIdApi(EntityName.Series, id)
                }
                return deleteNavigationApi(type, id)
            })()
            const executeDelete = await targetApi
            if (executeDelete?.isSuccess) {
                renderToGetData()
            }
        }
    }
    const handleSelect = (type: NavigationTreeItemType, item: NavigationTreeItem) => {
        switch (type) {
            case "menu":
                setSelectedMenu(item)
                setSelectedSubCategoryId(undefined)
                break;
            case "subCategory":
                setSelectedSubCategoryId(item.id)
                break;
        }
    }
    const renderModal = () => {
        if (!isModalShow) {
            return null
        }
        return (
            <ModalContainer closeFn={closeModal} isOpen={true}>
                <Stack spacing={2}>
                    <NavigationModal
                        renderToGetData={renderToGetData}
                        modalDataProp={modalDataProp}
                        closeModal={closeModal}
                    />
                </Stack>
            </ModalContainer>)
    }
    const getSeriesTree = async () => {
        if (selectedSubCategoryId === undefined) {
            return
        }
        const response = await getSeriesTreeBySubCategoryIdApi(selectedSubCategoryId)
        if (response?.isSuccess) {
            setSeriesTreeData(response?.data)
        }
    }
    const getNavigationTree = async () => {
        const response = await getNavigationTreeApi()
        if (response.isSuccess) {
            setNavigationTreeData(response.data)
            if (selectedMenu) {
                const selectedMenuInNewData =
                    response.data.find(data => data.id === selectedMenu.id)
                if (selectedMenuInNewData) {
                    setSelectedMenu(selectedMenuInNewData)
                }
            }
        }
    }
    const handleCreateProductAtSereis = (seriesId: number) => { 
        navigateFn(`/productList/?${CREATE_PRODUCT_BY_SERIES_ID_QUERY_STR}=${seriesId}`)
    }
    useEffect(() => {
        setSelectedSubCategoryId(undefined)
        setSeriesTreeData([])
    }, [selectedMenu])
    useEffect(() => {
        if (selectedSubCategoryId) {
            getSeriesTree()
        }
    }, [selectedSubCategoryId])
    useEffect(() => {
        getSeriesTree()
        getNavigationTree()
    }, [toggleToRender])
    if (!navigationTreeData) {
        return null
    }
    return <>
        {renderModal()}
        <Stack
            direction="row"
            spacing={1}
            margin={1}
        >
            <Button
                variant="outlined"
                sx={{ backgroundColor: "white" }}
                size="small"
                onClick={() => handleCreate("menu", FAKE_ID_FOR_CREATE)}>
                新增大種類
            </Button>
            {
                navigationTreeData?.map(menu =>
                    <NavigationItem
                        key={menu.id}
                        data={menu}
                        handleSelect={handleSelect}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit} />
                )
            }
        </Stack>
        <Divider sx={{ margin: 1 }} />
        <Box display={"flex"}>
            <Stack spacing={0.5} sx={{  minWidth: DRAWER_WIDTH, margin: 1 }}>
                {
                    selectedMenu &&
                    <>
                        <Button
                            variant="outlined"
                            sx={{ backgroundColor: "white" }}
                            onClick={() => handleCreate("category", selectedMenu.id)}>
                            新增種類
                        </Button>
                        {
                            selectedMenu?.children.map(category =>
                                <Box key={category.id}>
                                    <NavigationItem
                                        data={category}
                                        handleSelect={handleSelect}
                                        handleDelete={handleDelete}
                                        handleEdit={handleEdit} />
                                    <Stack spacing={0.5} margin={0.5} sx={{ paddingLeft: 3 }}>
                                        <Button
                                            variant="outlined"
                                            sx={{ backgroundColor: "white" }}
                                            onClick={() => handleCreate("subCategory", category.id)}>
                                            新增副種類
                                        </Button>
                                        {
                                            category.children.map(subCategory =>
                                                <NavigationItem
                                                    key={subCategory.id}
                                                    data={subCategory}
                                                    handleSelect={handleSelect}
                                                    handleDelete={handleDelete}
                                                    handleEdit={handleEdit} />)
                                        }
                                    </Stack>
                                </Box>
                            )
                        }
                    </>
                }
            </Stack>
            <Divider orientation="vertical" variant="middle" flexItem />
            <Stack spacing={0.5} sx={{ margin: 1, flexGrow: 1 }}>
                {selectedSubCategoryId &&
                    <Button
                        variant="outlined"
                        sx={{ backgroundColor: "white" }}
                        onClick={() => handleCreate("series", selectedSubCategoryId)}>
                        新增系列
                    </Button>
                }
                {seriesTreeData?.map(series =>
                    <Grid container key={series.id} spacing={0.5}>
                        <Grid item xs={12}>
                            {series.name}
                            <IconButton
                                onClick={() => handleEdit({
                                    ...series,
                                    children: [],
                                    route: "",
                                    parentId: (selectedSubCategoryId as number),
                                    type: "series"
                                })} aria-label="edit" size="small">
                                <EditOutlinedIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton
                                onClick={() => handleDelete(series.id, "series")}
                                aria-label="delete"
                                size="small" >
                                <DeleteForeverOutlinedIcon fontSize="inherit" />
                            </IconButton>
                            <Button onClick={() => handleCreateProductAtSereis(series.id)} variant="outlined">在此系列中新增產品</Button>
                        </Grid>
                        {series.products.map(p =>
                            <Grid item key={p.id} xs={2}>
                                <ProductCard key={p.id} productCardData={p} />
                            </Grid>
                        )}
                    </Grid>
                )}
            </Stack>
        </Box>
    </>
}