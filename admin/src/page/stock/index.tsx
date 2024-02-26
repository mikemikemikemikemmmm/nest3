import { getBaseApi } from "@/api/base"
import { GetOneResponse } from "@/api/entityType"
import { ProductWithStock, SubproductWithStock, getProductWithStockApi } from "@/api/page/stock"
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import React, { useEffect, useState } from "react"
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { EntityName, getAllApi } from "@/api/entity"
import { getColorImageUrlApi } from "@/api/staticFile"
import { Link } from "react-router-dom"
import { Button, IconButton, Stack } from "@mui/material"
import { ModalDataProp, StockModal } from "./modal"
import { ModalContainer } from "@/component/modalContainer"

const columnWidth = {
    productName: 100,
    size: 20
}
export const StockPage = () => {
    const [productWithStock, setProductWithStock] = useState<ProductWithStock[]>()
    const [sizes, setSizes] = useState<GetOneResponse.Size[]>()
    const [modalProp, setModalProp] = useState<ModalDataProp | undefined>(undefined)
    const [toggle, setToggle] = useState(false)
    const handleClickToEdit = (productWithStockData: ProductWithStock, targetSubproductId: number) => {
        setModalProp({ ...productWithStockData, targetSubproductId })
    }
    const closeModal = () => {
        setModalProp(undefined)
    }
    const renderToGetNewData = () => {
        setToggle(!toggle)
    }
    const getStocks = async () => {
        const get = await getProductWithStockApi()
        if (get?.isSuccess) {
            setProductWithStock(get.data)
        }
    }
    const getSizes = async () => {
        const get = await getAllApi<GetOneResponse.Size[]>(EntityName.Size)
        if (get?.isSuccess) {
            setSizes(get.data)
        }
    }
    const renderStock = (subproduct: SubproductWithStock) => {
        return sizes?.map(size => (
            <TableCell data- key={size.id} sx={{ padding: 0 }} align="center">
                {subproduct.stocks.find(st => st.sizeName === size.name)?.stock || "0"}
            </TableCell>
        ))
    }
    useEffect(() => {
        getStocks()
    }, [toggle])
    useEffect(() => {
        getSizes()
    }, [])
    if (!productWithStock || !sizes) {
        return null
    }
    return (
        <TableContainer sx={{ position: "relative", padding: 2, marginX: "auto", width: "50%" }} component={Paper}>
            <ModalContainer closeFn={closeModal} isOpen={modalProp !== undefined}>
                <Stack spacing={2}>
                    <StockModal
                        modalDataProp={modalProp as ModalDataProp}
                        forcedRender={renderToGetNewData}
                        closeModal={closeModal}
                    />
                </Stack>
            </ModalContainer>
            <Table size="small" stickyHeader>
                <TableHead>
                    <TableRow>
                        <TableCell
                            align={"left"}
                            style={{ minWidth: columnWidth.productName }}
                        >
                            產品名稱
                        </TableCell>
                        {sizes?.map(s => (
                            <TableCell
                                key={s.id}
                                align={"center"}
                                style={{ minWidth: columnWidth.size }}
                            >
                                {s.name}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {productWithStock
                        .map(product => {
                            return (
                                <React.Fragment key={product.id}>
                                    <TableRow hover>
                                        <TableCell>
                                            <Link to={`/detail/${product.id}`}>
                                                {product.name}-{product.genderName}
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                    {
                                        product.subproducts.map(sp => (
                                            <TableRow
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                hover
                                                key={sp.id}>
                                                <TableCell
                                                    sx={{ display: "flex", alignItems: "center" }}>
                                                    <img
                                                        src={getColorImageUrlApi(sp.colorId)}
                                                        style={{ height: 22, marginRight: 8 }}
                                                    />
                                                    <span>
                                                        {sp.colorName}
                                                    </span>
                                                    <IconButton
                                                        onClick={() => handleClickToEdit(product, sp.id)}
                                                        aria-label="edit"
                                                        size="small">
                                                        <EditOutlinedIcon fontSize="inherit" />
                                                    </IconButton>
                                                </TableCell>
                                                {
                                                    renderStock(sp)
                                                }
                                            </TableRow>
                                        ))
                                    }
                                </React.Fragment>
                            );
                        })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}