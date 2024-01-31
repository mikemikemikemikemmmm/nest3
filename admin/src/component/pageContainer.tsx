import { Box } from "@mui/system"
import { AlertContainer } from "./alert"
import DrawerNavigation from "./drawer"
import { LoadingContainer } from "./loading"

export const PageContainer = (props: { children: JSX.Element, hasNav?: boolean }) => {
    const { children, hasNav = true } = props
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
                {hasNav && <DrawerNavigation />}
                {children}
            </Box>
        </>)
}