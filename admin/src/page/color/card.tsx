import { useState } from "react"
import { getColorImageUrlApi } from "../../api/staticFile"
import { EntityName, deleteOneByIdApi } from "../../api/entity"
import {  Button, Card, Grid, IconButton } from "@mui/material"
import { ColorModalData } from "./modal"
import { handleImgError } from "../../utils/imgError"
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';
export const ColorCard = (props: {
    id: number,
    name: string,
    forcedRender: () => void,
    handleSelectColor: (colorId: number) => void
    handleEditColor: (colorData: ColorModalData) => void
}) => {
    const { id, name, forcedRender, handleSelectColor, handleEditColor } = props
    const [timestamp, setTimestamp] = useState(() => new Date().getTime())
    const imgUrl = getColorImageUrlApi(id, timestamp)
    const handleClickEdit = () => {
        handleEditColor({ id, name })
    }
    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        if (confirm('確定刪除嗎')) {
            const executeDelete = await deleteOneByIdApi(EntityName.Color, id)
            if (!executeDelete.error) {
                forcedRender()
            }
        }
    }
    return (
        <>
            <Grid item md={2} sm={3} xs={6}>
                <Card sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={() => handleSelectColor(id)}>
                        <div style={{ textAlign: 'center', color: 'black' }}>
                            <div>{name}</div>
                            <div >
                                <img src={imgUrl} onError={e => handleImgError(e)} alt={name} width={48} height={48} />
                            </div>
                        </div>
                    </Button>
                    <span>
                        <IconButton sx={{ display: 'flex' }} aria-label="delete" onClick={(e) => handleDelete(e)}>
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