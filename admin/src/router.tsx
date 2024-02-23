import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "./App";
import { ColorPage } from "./page/color";
import { LoginPage } from "./page/login";
import { NavigationPage } from "./page/navigation";
import { ProductListPage } from "./page/productList";
import { ProductDetailPage } from "./page/productdetail";
import { StockPage } from "./page/stock";
export const childrenRoute: (RouteObject & { name: string, showOnDrawer?: boolean })[] = [
    {
        path: "/",
        element: <LoginPage />,
        name: "登入"
    },
    {
        path: "/navigation",
        element: <NavigationPage />,
        name: "種類"
    },
    {
        path: "/color",
        element: <ColorPage />,
        name: "顏色"
    },
    {
        path: "/productList",
        element: <ProductListPage />,
        name: "產品列表",
    },
    {
        path: "/detail/:productId",
        name: "產品細節",
        showOnDrawer: false,
        element: <ProductDetailPage />
    },
    {
        path: "/stock",
        name: "存貨",
        element: <StockPage />
    },
    {
        path: "*",
        name:"index",
        showOnDrawer: false,
        element: <LoginPage />
    },
]

export const browserRouter = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: childrenRoute,
    },
]);