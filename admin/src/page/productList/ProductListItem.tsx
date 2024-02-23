import { Box, Card, Grid, IconButton, ListItem } from "@mui/material"
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ProductListItemData } from "@/api/page/productList";
import { Link } from "react-router-dom";
import { getImgUrlBySubProductIdApi, getProductImgUrlApi } from "@/api/staticFile";
import { handleImgError } from "@/utils/imgError";

interface Props {
    productListItemData: ProductListItemData
    handleEdit: (data: ProductListItemData) => void
    handleSelect: (id: number) => void
    handleDelete: (id: number) => void
}
const imageWidth = 80
export const ProductListItem = (props: Props) => {
    const { productListItemData } = props
    const renderProductImage = () => {
        const { imageCount } = productListItemData
        const domList = [] as JSX.Element[]
        for (let i = 0; i < imageCount; i++) {
            const imgGrid = (
                <Grid item sm={2} xs={4} key={i} >
                    <img
                        width={"100%"}
                        onError={(e) => handleImgError(e)}
                        src={getProductImgUrlApi(productListItemData.id, i + 1)} />
                </Grid>)
            domList.push(imgGrid)
        }
        return domList
    }
    return (
        <Card sx={{ margin: 1, padding: 1 }} >
            <div style={{display:"flex"}}>
                <Link style={{ position: "relative", display: "inline-block", width: imageWidth, height: imageWidth }} to={`/detail/${productListItemData.id}`}>
                    <img
                        style={{ height: imageWidth }}
                        src={getImgUrlBySubProductIdApi(productListItemData.subproductId)}
                        alt={productListItemData.name}
                        onError={e => handleImgError(e)} />
                    <Box sx={{
                        width: "100%",
                        height: "100%",
                        ":hover": {
                            backgroundColor: "rgba(0, 0, 0, 0.1)"
                        },
                        backgroundColor: "transparent",
                        position: "absolute",
                        left: 0,
                        top: 0
                    }} />
                </Link>
                <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <Box style={{ display: "flex", alignItems: "center" }}>
                        <Box margin={1}>
                            名稱:{productListItemData.name}-{productListItemData.genderName}
                        </Box>
                        <IconButton
                            style={{ marginLeft: "auto" }}
                            onClick={() => props.handleEdit(productListItemData)}
                            aria-label="edit"
                            size="small">
                            <EditOutlinedIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                            onClick={() => props.handleDelete(productListItemData.id)}
                            aria-label="delete"
                            size="small" >
                            <DeleteForeverOutlinedIcon fontSize="inherit" />
                        </IconButton>
                    </Box>
                    <Box margin={1}>
                        種類:{productListItemData.navigationName}
                    </Box>
                </Box>
            </div>
            <Box margin={1}>
            <Grid container spacing={1}>
                {renderProductImage()}
            </Grid></Box>
        </Card >)
}