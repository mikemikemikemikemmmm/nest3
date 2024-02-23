import { Card } from "@mui/material"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getImgUrlBySubProductIdApi } from "@/api/staticFile"
import { handleImgError } from "@/utils/imgError"
import errorImgUrl from '@/assets/imgError.jpg'
import { GetOneResponse } from "@/api/entityType"


export const ProductCard = (props: { productCardData: GetOneResponse.ProductCard }) => {
    const { productCardData } = props
    const { id, name, subproductId } = productCardData
    const [imgUrl, setImgUrl] = useState<'loading' | 'error' | string>('loading')
    const getProductImgUrl = () => {
        if (subproductId === null) {
            setImgUrl(errorImgUrl)
            return
        }
        const srcResult = getImgUrlBySubProductIdApi(subproductId)
        setImgUrl(srcResult||"error")
    }
    useEffect(() => { getProductImgUrl() }, [])
    return <Card sx={{ padding: 1, textAlign: 'center' }}>
        <Link to={`/detail/${id}`}>
            {
                imgUrl === 'loading' ?
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div className="loading-ring"><div></div><div></div><div></div><div></div></div>
                    </div>
                    :
                    <img style={{ width: '100%' }} src={imgUrl} alt={name} onError={e => handleImgError(e)} />
            }
            <div>{name}</div>
        </Link>
    </Card>
}