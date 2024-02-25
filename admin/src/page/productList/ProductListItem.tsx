import { Box, Button, Card, Grid, IconButton, ListItem } from "@mui/material"
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { ProductListItemData, deleteProductImgApi, insertProductImgApi, updateProductImgApi } from "@/api/page/productList";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { Link } from "react-router-dom";
import { getImgUrlBySubProductIdApi, getProductImgUrlApi } from "@/api/staticFile";
import { handleImgError } from "@/utils/imgError";
import { dispatchError } from "@/utils/errorHandler";
import { setIsLoading } from "@/store";
import { useDispatch } from "react-redux";
import { PRODUCT_HEIGHT, PRODUCT_WIDTH } from "@/const";

interface Props {
    productListItemData: ProductListItemData
    handleEdit: (data: ProductListItemData) => void
    handleSelect: (id: number) => void
    handleDelete: (id: number) => void
    rerender: () => void
}
const imageWidth = 80
const gridXs = 6
const gridSm = 3
export const ProductListItem = (props: Props) => {
    const { productListItemData } = props
    const dispatch = useDispatch()
    const handleDeleteImage = async (imageName: string) => {
        if (confirm("確認刪除嗎")) {
            const del = await deleteProductImgApi(productListItemData.id, imageName)
            if (del.isSuccess) {
                props.rerender()
            }
            dispatch(setIsLoading(false))
        }
    }
    const renderProductImage = () => {
        const { imageFileNameListStringifyJson } = productListItemData
        const domList = [] as JSX.Element[]
        const imgFileList: string[] = JSON.parse(imageFileNameListStringifyJson)
        imgFileList.forEach(imageName => {
            const imgGrid = (
                <Grid item sm={gridSm} xs={gridXs} key={imageName} position={"relative"} >
                    <span style={{ position: "absolute", top: 10, right: 0 }}>
                        <IconButton
                            sx={{ display: "block" }}
                            size="small"
                            component="label">
                            <EditOutlinedIcon fontSize="inherit" />
                            <input hidden accept=".jpg" type="file" onChange={e => handleUploadImg(e, imageName)} />
                        </IconButton>
                        <IconButton
                            sx={{ display: "block" }}
                            onClick={() => handleDeleteImage(imageName)}
                            aria-label="delete"
                            size="small" >
                            <DeleteForeverOutlinedIcon fontSize="inherit" />
                        </IconButton>
                    </span>
                    <img
                        width={"100%"}
                        onError={(e) => handleImgError(e)}
                        src={getProductImgUrlApi(productListItemData.id, imageName)} />
                </Grid>)
            domList.push(imgGrid)
        })
        return domList
    }
    const handleUploadImg = (e: React.ChangeEvent<HTMLInputElement>, imageName?: string) => {
        const uploadedImageFile = e.target.files?.[0]
        if (!uploadedImageFile) {
            dispatchError('上傳圖片失敗')
            return
        }
        dispatch(setIsLoading(true))
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
            if (!e.target?.result) {
                dispatch(setIsLoading(false))
                dispatchError('上傳圖片失敗')
                return
            }
            const tempImageBase64Url = e.target.result as string
            const tempImageDom = new Image()
            tempImageDom.onload = async () => {
                const { width } = tempImageDom
                const { height } = tempImageDom
                if (width !== PRODUCT_WIDTH ||
                    height !== PRODUCT_HEIGHT) {
                    dispatch(setIsLoading(false))
                    dispatchError(`寬須為${PRODUCT_WIDTH}px，高須為${PRODUCT_HEIGHT}px`)
                    return
                }
                if (imageName) {
                    const update = await updateProductImgApi(uploadedImageFile, productListItemData.id,imageName)
                    if (update.isSuccess) {
                        props.rerender()
                    }
                } else {
                    const insert = await insertProductImgApi(uploadedImageFile, productListItemData.id)
                    if (insert.isSuccess) {
                        props.rerender()
                    }
                }
                dispatch(setIsLoading(false))
            }
            tempImageDom.src = tempImageBase64Url
        };
        fileReader.readAsDataURL(uploadedImageFile);
    }
    return (
        <Card sx={{ margin: 1, padding: 1 }} >
            <div style={{ display: "flex" }}>
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
                    <Grid item sm={gridSm} xs={gridXs} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <IconButton color="primary" component="label">
                            <AddPhotoAlternateIcon />
                            <input hidden accept=".jpg" type="file" width={760} onChange={e => handleUploadImg(e)} />
                        </IconButton>
                    </Grid>
                </Grid>

            </Box>
        </Card >)
}