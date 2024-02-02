import {  Outlet} from "react-router-dom";
import { Box } from "@mui/material";
import { LoadingContainer } from "./component/loading";
import { AlertContainer } from "./component/alert";
import DrawerAside from './component/drawerAside';
export default function App() {
  console.log('app render')
  return (
    <>
      <LoadingContainer />
      <AlertContainer />
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) => theme.palette.grey[100],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <DrawerAside />
        <Outlet />
      </Box>
    </>
  );
}
