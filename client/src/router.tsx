
import { createBrowserRouter, createHashRouter, RouteObject, RouterProvider } from 'react-router-dom'
import { DetailPage } from './page/detail'
import { getAllNavApi,  getProductDetailByProductIdApi, getSeriesDataApi, SeriesData } from './api/get'
import { ProductListPage } from './page/list'
import { ErrorComponent } from './component/errorComponent'
import { errorHandler } from './errorHandler'
import { IndexPage } from './page'
import App from './App'
import { ErrorPage } from './page/error'

export const childrenRoute: RouteObject[] = [
    {
        element: <IndexPage />,
        path: ""
    },
    {
        errorElement: <ErrorPage />,
        element: <DetailPage />,
        path: "detail/:productId",
        loader: async ({ params }) => {
            const productId = Number(params.productId)
            if (!Number.isInteger(productId) || productId <= 0) {
                throw Error
            }
            const result = await getProductDetailByProductIdApi(productId)
            if (!result.isSuccess) {
                return errorHandler(result.errorMessage)
            }
            return { productDetailData: result.data,menuRoute:result.data.menuRoute }
        }
    },
    {
        errorElement: <ErrorComponent />,
        element: <ProductListPage />,
        path: ":navRoute/:categoryRoute/:subcategoryRoute",
        loader: async ({ params }) => {
            const { navRoute, categoryRoute, subcategoryRoute } = params
            if(!navRoute){
                throw Error
            }
            const result = await getSeriesDataApi(navRoute, categoryRoute, subcategoryRoute)
            if (!result.isSuccess) {
                return errorHandler(result.errorMessage)
            }
            return { seriesDatas: result.data }

        }
    },
    {
        element: <ProductListPage />,
        path: ":navRoute",
        loader: async ({ params ,}) => {
            const { navRoute } = params
            if(!navRoute){
                return { seriesDatas: undefined }
            }
            const result = await getSeriesDataApi(navRoute)
            if (!result.isSuccess) {
                return { seriesDatas: undefined }
            }
            return { seriesDatas: result.data }

        }
    },
]

export const browserRouter = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: childrenRoute,
        errorElement: <ErrorPage />,
        loader: async () => {
            const result = await getAllNavApi()
            if (result.isSuccess) {
                return { navigationData: result.data }
            } else {
                throw Error
            }
        },
    },
]);