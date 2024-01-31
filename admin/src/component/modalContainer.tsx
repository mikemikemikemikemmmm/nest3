import { Modal, Box, Stack } from "@mui/material";
import { ReactNode } from "react";
import { Theme } from '@mui/material/styles/createTheme'
import { SxProps } from '@mui/system/styleFunctionSx/styleFunctionSx'
import { MODAL_MOUNT_DOM_ID } from "../const";
// export const ModalContainer = () => {
//     const style = {
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         maxHeight: '80%',
//         maxWidth: '80%',
//         bgcolor: 'background.paper',
//         boxShadow: 24,
//         p: 4,
//     };
//     let _style: SxProps<Theme> = { ...style }
//     return (
//         <Modal         >
//             <Box sx={_style}>
//                 <div id={MODAL_MOUNT_DOM_ID}></div>
//             </Box>
//         </Modal>
//     );
// }