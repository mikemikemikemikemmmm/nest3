import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "./App";
import { ColorPage } from "./page/color";
import { LoginPage } from "./page/login";
import { ProductDetailPage } from "./page/productdetail";
import { NavigationPage } from "./page/navigation";
import { StockPage } from "./page/stock";
export const childrenRoute: (RouteObject & { name: string })[] = [
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
        name: "產品列表"
    },
    {
        path: "/productDetail/:productId",
        element: <ProductDetailPage />,
        name: "產品細節"
    },
    {
        path: "/stock",
        element: <StockPage />,
        name: "存貨"
    }
]

export const browserRouter = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: childrenRoute,
    },
]);