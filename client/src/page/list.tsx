import { useLoaderData, useNavigate, useParams } from "react-router-dom"
import { SeriesData } from "../api/get"
import { ProductCardComponent } from "../component/productCard"
import { getMenuBannerImgUrlApi } from "../api/staticFile"
import { NavigationState, useAppSelector } from "../store"
import { useGetMenuRoute } from "../utils"
export const ProductListPage = () => {
    const menuRoute = useGetMenuRoute()
    const { seriesDatas } = useLoaderData() as { seriesDatas: SeriesData[] }
    const { navigationTree } = useAppSelector(s => s.navSlice) as NavigationState
    const currentMenu = navigationTree.find(menu => menu.route === menuRoute)
    const { categoryRoute, subcategoryRoute } = useParams()
    const isMenuIndex = !categoryRoute && !subcategoryRoute
    return (
            <div className="inline-block flex-1">
                {
                    isMenuIndex &&
                        <img className="block w-full mb-10" src={getMenuBannerImgUrlApi(String(currentMenu?.id) || "")} />
                }
                {seriesDatas.length === 0 ?
                    <div className="text-3xl w-full h-full flex items-center justify-center">無資料</div> :
                    <ul>
                        {seriesDatas.map(series => <li key={series.id}>
                            {
                                isMenuIndex ||
                                <div className="text-xl mb-4 text-black font-bold">{series.name}</div>
                            }
                            <div className="flex">
                                {series.productCards.map(card =>
                                    <ProductCardComponent key={card.id} {...card} />
                                )}
                            </div>
                        </li>)}
                    </ul>
                }
            </div>
    )
}