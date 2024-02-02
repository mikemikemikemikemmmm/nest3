import { Modal, Box, Stack } from "@mui/material";
import { ReactNode } from "react";
import { Theme } from '@mui/material/styles/createTheme'
import { SxProps } from '@mui/system/styleFunctionSx/styleFunctionSx'
export const ModalContainer = (
    props: {
        children: JSX.Element,
        closeFn: () => void,
        isOpen: boolean
    }) => {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxHeight: '80%',
        maxWidth: '80%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };
    const _style: SxProps<Theme> = { ...style }
    return (
        <Modal open={props.isOpen}>
            <Box sx={_style}>
                {props.children}
            </Box>
        </Modal>
    );
}