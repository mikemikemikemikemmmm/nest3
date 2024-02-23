import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import { LoadingContainer } from "./component/loading";
import { AlertContainer } from "./component/alert";
import DrawerAside from './component/drawerAside';
export default function App() {
  return (
    <Box
      sx={{
        position: "relative"
      }}>
      <LoadingContainer />
      <AlertContainer />
      <Container
        component="main"
        sx={{ height: "100vh" }}
      >
        <DrawerAside />
        <Outlet />
      </Container>
    </Box>
  );
}
