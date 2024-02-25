import { useEffect, useLayoutEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getProductMenuRouteApi } from "./api/get"

export const useGetMenuRoute = () => {
    const { productId, menuRoute } = useParams()
    const [_menuRoute, setMenuRoute] = useState(menuRoute)
    const getProductMenuRoute = async () => {
        const get = await getProductMenuRouteApi(productId as string)
        if (get.isSuccess) {
            setMenuRoute(get.data.menuRoute)
        }
    }
    useLayoutEffect(() => {
        if (menuRoute) {
            setMenuRoute(menuRoute)
            return
        }
        if (productId) {
            getProductMenuRoute()
            return
        }
        setMenuRoute("")
    }, [productId, menuRoute])
    return _menuRoute
}