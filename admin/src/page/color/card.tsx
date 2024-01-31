import { useState } from "react"
import { getColorImageUrlApi } from "../../api/staticFile"
import { EntityName, deleteOneByIdApi } from "../../api/entity"
import { Box, Grid, Stack } from "@mui/material"

export const ColorCard = (props: {
    id: number,
    name: string,
    forcedRender: () => void,
    selectColor: (colorId: number) => void
}) => {
    const { id, name, forcedRender, selectColor } = props
    const [timestamp, setTimestamp] = useState(() => new Date().getTime())
    const [modalData, setModalData] = useState<{ id: number, name: string } | undefined>(undefined)
    const imgUrl = getColorImageUrlApi(id, timestamp)
    const handleEdit = (id: number, name: string) => {
        setModalData({ id, name })
    }
    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
        e.stopPropagation()
        if (confirm('確定刪除嗎')) {
            const executeDelete = await deleteOneByIdApi(EntityName.Color, id)
            if (!executeDelete?.error) {
                forcedRender()
            }
        }
    }
    const closeModal = () => {
        setModalData(undefined)
    }
    const renderModal = () => {
        if (modalData === undefined) {
            return null
        }
        return <ModalContainer closeFn={closeModal} isOpen={true}>
            <Stack spacing={2}>
                <ColorModal
                    imgUrlProp={imgUrl}
                    setTimestamp={setTimestamp}
                    modalData={modalData}
                    forcedRender={forcedRender}
                    closeModal={closeModal}
                />
            </Stack>
        </ModalContainer>
    }
    return (
        <>
            {
                renderModal()
            }
            <Grid item md={2} sm={3} xs={6}>
                <Card sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={() => selectColor(id)}>
                        <Box sx={{ textAlign: 'center', Color: 'black' }}>
                            <div>{name}</div>
                            <div >
                                <img src={imgUrl} onError={e => handleImgError(e)} alt={name} width={48} height={48} />
                            </div>
                        </Box>
                    </Button>
                    <span>
                        <IconButton sx={{ display: 'flex' }} aria-label="delete" onClick={(e) => handleDelete(e, id)}>
                            <HighlightOffIcon sx={{ color: 'red' }} />
                        </IconButton>
                        <IconButton sx={{ display: 'flex' }} aria-label="edit" onClick={() => handleEdit(id, name)}>
                            <EditIcon sx={{ color: 'black' }} />
                        </IconButton>
                    </span>
                </Card>
            </Grid>
        </>
    )
}