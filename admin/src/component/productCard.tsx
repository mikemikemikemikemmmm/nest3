import { Card } from "@mui/material"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { getImgUrlBySubProductIdApi } from "../api/staticFile"
import { handleImgError } from "../utils/imgError"
import errorImgUrl from '../assets/imgError.jpg'


export const ProductCard = (props: { id: number, text: string, firstSubProductId: number | null }) => {
    const { id, text, firstSubProductId } = props
    const [imgUrl, setImgUrl] = useState<'loading' | 'error' | string>('loading')
    const getProductImgUrl = () => {
        if (firstSubProductId === null) {
            setImgUrl(errorImgUrl)
            return
        }
        const srcResult = getImgUrlBySubProductIdApi(firstSubProductId)
        setImgUrl(srcResult)
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
                    <img style={{ width: '100%' }} src={imgUrl} alt={text} onError={e => handleImgError(e)} />
            }
            <div>{text}</div>
        </Link>
    </Card>
}