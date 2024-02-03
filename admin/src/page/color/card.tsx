import { useState } from "react"
import { getColorImageUrlApi } from "../../api/staticFile"
import { EntityName, deleteOneByIdApi } from "../../api/entity"
import { Button, Card, Grid, IconButton } from "@mui/material"
import { ColorModalData } from "./modal"
import { handleImgError } from "../../utils/imgError"
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';
import { GetOneResponse } from "../../api/entityType"
import { WifiProtectedSetupRounded } from "@mui/icons-material"
export const ColorCard = (props: {
    colorData: GetOneResponse.Color
    handleSelect: (id: number) => void
    handleEdit: (colorData: ColorModalData) => void
    handleDelete: (id: number) => void
}) => {
    const { colorData, handleSelect, handleEdit } = props
    const [timestamp, setTimestamp] = useState(() => new Date().getTime())
    const imgUrl = getColorImageUrlApi(colorData.id, timestamp)
    const handleClickEdit = () => {
        handleEdit(colorData)
    }
    const handleClickDelete = () => {
        props.handleDelete(colorData.id)
    }
    return (
        <>
            <Grid item md={2} sm={3} xs={6}>
                <Card sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={() => handleSelect(colorData.id)}>
                        <div style={{ textAlign: 'center', color: 'black' }}>
                            <div>{colorData.name}</div>
                            <div >
                                <img src={imgUrl} onError={e => handleImgError(e)} alt={colorData.name} width={48} height={48} />
                            </div>
                        </div>
                    </Button>
                    <span>
                        <IconButton sx={{ display: 'flex' }} aria-label="delete" onClick={() => handleClickDelete()}>
                            <HighlightOffIcon sx={{ color: 'red' }} />
                        </IconButton>
                        <IconButton sx={{ display: 'flex' }} aria-label="edit" onClick={() => handleClickEdit()}>
                            <EditIcon sx={{ color: 'black' }} />
                        </IconButton>
                    </span>
                </Card>
            </Grid>
        </>
    )
}