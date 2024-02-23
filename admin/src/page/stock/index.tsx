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
    const isModalShow = modalProp === undefined
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
    const renderModal = () => {
        if (isModalShow) {
            return null
        }
        return (
            <ModalContainer closeFn={closeModal} isOpen={true}>
                <Stack spacing={2}>
                    <StockModal
                        modalDataProp={modalProp}
                        forcedRender={renderToGetNewData}
                        closeModal={closeModal}
                    />
                </Stack>
            </ModalContainer>)
    }
    if (!productWithStock || !sizes) {
        return null
    }
    return (
        <TableContainer sx={{ position: "relative", padding: 2, marginX: "auto", width: "50%" }} component={Paper}>
            {
                renderModal()
            }
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
            {/* <div style={{position:"absolute",left:0,top:0,width:columnWidth.size,backgroundColor:"red"}}>12312412</div> */}
        </TableContainer>
    )
}
// interface Column {
//     id: 'name' | 'code' | 'population' | 'size' | 'density';
//     label: string;
//     minWidth?: number;
//     align?: 'right';
//     format?: (value: number) => string;
// }

// const columns: readonly Column[] = [
//     { id: 'name', label: 'Name', minWidth: 170 },
//     { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
//     {
//         id: 'population',
//         label: 'Population',
//         minWidth: 170,
//         align: 'right',
//         format: (value: number) => value.toLocaleString('en-US'),
//     },
//     {
//         id: 'size',
//         label: 'Size\u00a0(km\u00b2)',
//         minWidth: 170,
//         align: 'right',
//         format: (value: number) => value.toLocaleString('en-US'),
//     },
//     {
//         id: 'density',
//         label: 'Density',
//         minWidth: 170,
//         align: 'right',
//         format: (value: number) => value.toFixed(2),
//     },
// ];

// interface Data {
//     name: string;
//     code: string;
//     population: number;
//     size: number;
//     density: number;
// }

// function createData(
//     name: string,
//     code: string,
//     population: number,
//     size: number,
// ): Data {
//     const density = population / size;
//     return { name, code, population, size, density };
// }

// const rows = [
//     createData('India', 'IN', 1324171354, 3287263),
//     createData('China', 'CN', 1403500365, 9596961),
//     createData('Italy', 'IT', 60483973, 301340),
//     createData('United States', 'US', 327167434, 9833520),
//     createData('Canada', 'CA', 37602103, 9984670),
//     createData('Australia', 'AU', 25475400, 7692024),
//     createData('Germany', 'DE', 83019200, 357578),
//     createData('Ireland', 'IE', 4857000, 70273),
//     createData('Mexico', 'MX', 126577691, 1972550),
//     createData('Japan', 'JP', 126317000, 377973),
//     createData('France', 'FR', 67022000, 640679),
//     createData('United Kingdom', 'GB', 67545757, 242495),
//     createData('Russia', 'RU', 146793744, 17098246),
//     createData('Nigeria', 'NG', 200962417, 923768),
//     createData('Brazil', 'BR', 210147125, 8515767),
// ];

// export default function StickyHeadTable() {
//     const [page, setPage] = React.useState(0);
//     const [rowsPerPage, setRowsPerPage] = React.useState(10);

//     const handleChangePage = (event: unknown, newPage: number) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setRowsPerPage(+event.target.value);
//         setPage(0);
//     };

//     return (
//         <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//             <TableContainer sx={{ maxHeight: 440 }}>
//                 <Table stickyHeader aria-label="sticky table">
//                     <TableHead>
//                         <TableRow>
//                             {columns.map((column) => (
//                                 <TableCell
//                                     key={column.id}
//                                     align={column.align}
//                                     style={{ minWidth: column.minWidth }}
//                                 >
//                                     {column.label}
//                                 </TableCell>
//                             ))}
//                         </TableRow>
//                     </TableHead>
//                     <TableBody>
//                         {rows
//                             .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                             .map((row) => {
//                                 return (
//                                     <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
//                                         {columns.map((column) => {
//                                             const value = row[column.id];
//                                             return (
//                                                 <TableCell key={column.id} align={column.align}>
//                                                     {column.format && typeof value === 'number'
//                                                         ? column.format(value)
//                                                         : value}
//                                                 </TableCell>
//                                             );
//                                         })}
//                                     </TableRow>
//                                 );
//                             })}
//                     </TableBody>
//                 </Table>
//             </TableContainer>
//             <TablePagination
//                 rowsPerPageOptions={[10, 25, 100]}
//                 component="div"
//                 count={rows.length}
//                 rowsPerPage={rowsPerPage}
//                 page={page}
//                 onPageChange={handleChangePage}
//                 onRowsPerPageChange={handleChangeRowsPerPage}
//             />
//         </Paper>
//     );
// }