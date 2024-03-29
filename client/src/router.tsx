
import { createBrowserRouter, createHashRouter, RouteObject, RouterProvider } from 'react-router-dom'
import { DetailPage } from './page/detail'
import { getProductDetailByProductIdApi, getSeriesDataApi, SeriesData } from './api/get'
import { ProductListPage } from './page/list'
import { ErrorComponent } from './component/errorComponent'
import { IndexPage } from './page'
import App from './App'
import { ErrorPage } from './page/error'
import { WrapperWithAside } from './component/wrapperWithAside'
import { isDevEnviroment, NGINX_FOLDER_NAME } from './config'

export const childrenRoute: RouteObject[] = [
    {
        element: <IndexPage />,
        path: "/"
    },
    {
        element: <WrapperWithAside />,
        children: [{
            errorElement: <ErrorComponent />,
            element: <DetailPage />,
            path: "detail/:productId",
            loader: async ({ params }) => {
                const { productId } = params
                if (!productId) {
                    return null
                }
                const get = await getProductDetailByProductIdApi(productId as string)
                if (get.isSuccess) {
                    return { productDetailData: get.data }
                }
                return null
            }
        },
        {
            errorElement: <ErrorComponent />,
            element: <ProductListPage />,
            path: ":menuRoute/:categoryRoute/:subcategoryRoute",
            loader: async ({ params }) => {
                const { menuRoute, categoryRoute, subcategoryRoute } = params
                const get = await getSeriesDataApi(menuRoute as string, categoryRoute, subcategoryRoute)
                if (get.isSuccess) {
                    return { seriesDatas: get.data }
                }
                return null
            }
        },
        {
            errorElement: <ErrorComponent />,
            element: <ProductListPage />,
            path: ":menuRoute",
            loader: async ({ params }) => {
                const { menuRoute } = params
                const get = await getSeriesDataApi(menuRoute as string)
                if (get.isSuccess) {
                    if(!get.data.length){
                        return null
                    }
                    return { seriesDatas: get.data }
                }
            }
        },]
    },

]
export const browserRouter = createBrowserRouter([
    {
        path:"/",
        element: <App />,
        children: childrenRoute,
        errorElement: <ErrorPage />,
    },
],{
    basename:isDevEnviroment?"":`/${NGINX_FOLDER_NAME}/`
});

