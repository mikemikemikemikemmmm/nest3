import { Outlet, useLoaderData, useNavigate, useParams } from "react-router-dom"
import { SeriesData } from "../api/get"
import { ProductCardComponent } from "../component/productCard"
import { getMenuBannerImgUrlApi } from "../api/staticFile"
import { NavigationState, useAppSelector } from "../store"
import { useGetMenuRoute } from "../utils"
import { AsideComponent } from "../component/aside"
export const WrapperWithAside = () => {
    const menuRoute = useGetMenuRoute()
    return (
        <section className="flex">
            <AsideComponent menuRoute={menuRoute as string}/>
            <Outlet/>
        </section>
    )
}