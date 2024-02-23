import { Card, FormControl, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Button, TextField, Box } from "@mui/material";
import { GetOneResponse } from "../../api/entityType";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { getImgUrlBySubProductIdApi } from "@/api/staticFile";
import { handleImgError } from "@/utils/imgError";
const IMG_HEIGHT = 150
const TextSX = { margin: 0.5, fontSize: 14 }
export const SubProductCard = (props: {
    handleDelete: (subProductId: number) => void
    handleEdit: (subProductData: GetOneResponse.SubProduct) => void
    subProductData: GetOneResponse.SubProduct
}) => {
    const { handleDelete, handleEdit, subProductData } = props
    return (
        <Card
            sx={{ padding: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ flexGrow: 1 ,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <img
                    style={{ height: IMG_HEIGHT }}
                    src={getImgUrlBySubProductIdApi(subProductData.id,subProductData.updated_at)}
                    onError={e => handleImgError(e)} /></span>

            <span style={{ height: "100%", display: "inline-block" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <IconButton
                        onClick={() => handleEdit(subProductData)}
                        aria-label="edit"
                        size="small">
                        <EditOutlinedIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                        onClick={() => handleDelete(subProductData.id)}
                        aria-label="delete"
                        size="small" >
                        <DeleteForeverOutlinedIcon fontSize="inherit" />
                    </IconButton>
                </div>
                <Box sx={TextSX} >
                    顏色：{subProductData.colorName}
                </Box>
                <Box sx={TextSX} >
                    價格：{subProductData.price}
                </Box>
                <Box sx={TextSX} >
                    排序：{subProductData.order}
                </Box>
            </span>
        </Card >
    )
}