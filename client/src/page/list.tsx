import { useLoaderData, useNavigate, useParams } from "react-router-dom"
import { SeriesData } from "../api/get"
import { ProductCardComponent } from "../component/productCard"
export const ProductListPage = () => {
    const {seriesDatas} = useLoaderData() as { seriesDatas: SeriesData[] }
    const naviate =useNavigate()
    if(!seriesDatas){
        naviate("/")
        return
    }
    return (
        <div className="flex">
            {seriesDatas.length === 0 ?
                <div className=" text-center">無資料</div> :
                <ul>
                    {seriesDatas.map(series => <li key={series.id}>
                        <div>{series.name}</div>
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