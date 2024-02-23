import { getColorImageUrlApi } from "../../api/staticFile"
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Button, Card, Grid, IconButton } from "@mui/material"
import { ColorModalData } from "./modal"
import { handleImgError } from "../../utils/imgError"
import { GetOneResponse } from "../../api/entityType"
import { COLOR_IMG_HEIGHT, COLOR_IMG_WIDTH } from "../../const"
export const ColorCard = (props: {
    colorData: GetOneResponse.Color
    handleSelect: (id: number) => void
    handleEdit: (colorData: ColorModalData) => void
    handleDelete: (id: number) => void
}) => {
    const { colorData, handleSelect, handleEdit } = props
    const imgUrl = getColorImageUrlApi(colorData.id, colorData.updated_at)
    const handleClickEdit = () => {
        handleEdit(colorData)
    }
    const handleClickDelete = () => {
        props.handleDelete(colorData.id)
    }
    return (
        <Grid item md={2} sm={3} xs={6}>
            <Card sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button onClick={() => handleSelect(colorData.id)}>
                    <div style={{ textAlign: 'center', color: 'black' }}>
                        <div>{colorData.name}</div>
                        <div >
                            <img src={imgUrl}
                                onError={e => handleImgError(e)}
                                alt={colorData.name}
                                width={COLOR_IMG_WIDTH}
                                height={COLOR_IMG_HEIGHT} />
                        </div>
                    </div>
                </Button>
                <span style={{ display: "inline-flex",flexDirection:"column", alignItems: "center", justifyContent: "center" }}>
                    <IconButton
                        onClick={() => handleClickEdit()}
                        aria-label="edit"
                        size="small">
                        <EditOutlinedIcon fontSize="inherit" />
                    </IconButton>
                    <IconButton
                        onClick={() => handleClickDelete()}
                        aria-label="delete"
                        size="small" >
                        <DeleteForeverOutlinedIcon fontSize="inherit" />
                    </IconButton>
                </span>
            </Card>
        </Grid>
    )
}