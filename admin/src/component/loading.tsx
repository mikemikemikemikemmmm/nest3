
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
import { RootState } from '../../src/store'
import { ZIndex } from "@/const";
export const LoadingContainer = () => {
    const isLoading = useSelector((state: RootState) => state.appSlice.isLoading)
    return <Backdrop
        sx={{ bgcolor: 'transparent', color: 'black', zIndex: ZIndex.Loading }}
        open={isLoading}
    >
        <CircularProgress color="inherit" />
    </Backdrop>
}