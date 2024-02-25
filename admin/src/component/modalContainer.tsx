import { ZIndex } from "@/const";
import { Modal, Box } from "@mui/material";
import { Theme } from '@mui/material/styles/createTheme'
import { SxProps } from '@mui/system/styleFunctionSx/styleFunctionSx'
export const ModalContainer = (
    props: {
        children: JSX.Element,
        closeFn: () => void,
        isOpen: boolean
    }) => {
    const boxStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxHeight: '80%',
        maxWidth:"80%",
        overflow:"scroll",
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 3,
    } as  SxProps<Theme> 
    return (
        <Modal sx={{zIndex:ZIndex.Modal}} open={props.isOpen} onClose={props.closeFn}>
            <Box sx={boxStyle}>
                {props.children}
            </Box>
        </Modal>
    );
}