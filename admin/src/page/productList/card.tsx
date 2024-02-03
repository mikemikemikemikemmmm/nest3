import { useState } from "react"
import { getColorImageUrlApi } from "../../api/staticFile"
import { EntityName, deleteOneByIdApi } from "../../api/entity"
import { Button, Card, Grid, IconButton } from "@mui/material"
import { ProductModalData } from "./modal"
import { handleImgError } from "../../utils/imgError"
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import EditIcon from '@mui/icons-material/Edit';
import { GetOneResponse } from "../../api/entityType"
export const ProductCard = (props: {
    productCardData: GetOneResponse.Product
    handleSelect: (id: number) => void
    handleEdit: (productModalData: ProductModalData) => void
    handleDelete: (id: number) => void
}) => {
    const { productCardData } = props
    const { id, name } = productCardData
    const handleClickEdit = () => {
        props.handleEdit(productCardData)
    }
    const handleDelete = () => {
       props.handleDelete(productCardData.id)
    }
    return (
        <>
            <Grid item md={2} sm={3} xs={6}>
                <Card sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={() => props.handleSelect(id)}>
                        <div style={{ textAlign: 'center', color: 'black' }}>
                            <div>{name}</div>
                        </div>
                    </Button>
                    <span>
                        <IconButton sx={{ display: 'flex' }} aria-label="delete" onClick={(e) => handleDelete()}>
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