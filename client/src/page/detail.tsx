
import { useState } from 'react'
import { useLoaderData, useSearchParams } from 'react-router-dom'
import { errorHandler } from '../errorHandler'
import { APP_WIDTH, ASIDE_WIDTH } from '../style/const'
import { ProductDetailData, SizeData, SubproductData } from '../api/get'
import { URL_QUERY_SUBPRODUCT_ID_FOR_DETAIL } from '../config'
import { getColorImgUrlApi, getSubproductImgUrlInDetailPageApi } from '../api/staticFile'
export const DetailPage = () => {
    const { productDetailData } = useLoaderData() as { productDetailData: ProductDetailData }
    const { subproducts } = productDetailData
    const targetSubproductIdByQuery = useSearchParams()[0].get(URL_QUERY_SUBPRODUCT_ID_FOR_DETAIL)
    const [selectedSubproduct, setSelectedSubproduct] = useState<SubproductData | undefined>(() => {
        if (subproducts.length === 0) {
            return undefined
        }
        if (targetSubproductIdByQuery) {
            const numSubproductId = Number(targetSubproductIdByQuery)
            const target = subproducts.find(sp => sp.id === numSubproductId)
            if (!target) {
                return subproducts[0]
            } else {
                return target
            }
        } else {
            return subproducts[0]
        }
    })
    const [selectedSize, setSelectedSize] = useState<SizeData | undefined>(undefined)
    const handleSelectSize = (size: SizeData) => {
        setSelectedSize(size)
    }
    const handleSelectSubproduct = (subproductId: number) => {
        const target = subproducts.find(sp => sp.id === subproductId)
        if (!target) {
            return errorHandler('error')
        }
        setSelectedSubproduct(target)
    }
    return (
        <div style={{
            width: APP_WIDTH - ASIDE_WIDTH
        }}>
            <div className="inline-block w-1/2 align-top">
                <img src={getSubproductImgUrlInDetailPageApi(selectedSubproduct?.id)} alt={selectedSubproduct?.colorName} />
            </div>
            <div className="inline-block w-1/2 align-top">
                <div className='my-2'>
                    <span className='inline-block'>{`(${selectedSubproduct?.colorName})`}</span>
                    <span className='inline-block ml-4'>${selectedSubproduct?.price}</span>
                </div>
                <div className='my-2'>
                    {subproducts.map(sp => (
                        <button
                            onClick={() => handleSelectSubproduct(sp.id)}
                            className={`w-6 h-6 mr-2 p-1 border ${selectedSubproduct?.id === sp.id ? 'border-black' : 'border-white'}`}
                            key={sp.id}
                        >
                            <img src={getColorImgUrlApi(sp.colorId)} alt={sp.colorName} />
                        </button>
                    ))}
                </div>
                <div className="my-2">
                    {
                        selectedSubproduct &&
                        selectedSubproduct.sizes.map(size => (
                            <button
                                className={`py-2 px-7 mr-3 bg-slate-200 border ${selectedSize?.id === size.id ? 'border-black' : 'border-white'}`}
                                onClick={() => handleSelectSize(size)}
                                key={size.id}>
                                {size.name}
                            </button>))
                    }
                </div>
            </div>
        </div>
    )
}