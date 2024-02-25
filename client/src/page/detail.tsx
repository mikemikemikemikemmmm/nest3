
import { useRef, useState } from 'react'
import { useLoaderData, useSearchParams } from 'react-router-dom'
import { errorHandler } from '../errorHandler'
// import { APP_WIDTH, ASIDE_WIDTH } from '../style/const'
import { ProductDetailData, SizeData, SubproductData } from '../api/get'
import { URL_QUERY_SUBPRODUCT_ID_FOR_DETAIL } from '../config'
import { getColorImgUrlApi, getProductCardImgUrlApi, getProductImgUrlApi, getSubproductImgUrlInDetailPageApi } from '../api/staticFile'

export const DetailPage = () => {
    const { productDetailData } = useLoaderData() as { productDetailData: ProductDetailData }
    const { subproducts, imageFileNameListStringifyJson } = productDetailData
    const imgFileNameList = useRef<string[]>(JSON.parse(imageFileNameListStringifyJson))
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
    const [buyNum, setBuyNum] = useState<number>(1)

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
            <div className='inline-block flex-1'>
                <div className='mb-6'>
                    <div className="inline-flex justify-center w-1/2 align-top">
                        <img src={getSubproductImgUrlInDetailPageApi(selectedSubproduct?.id)} alt={selectedSubproduct?.colorName} />
                    </div>
                    <div className=" inline-block w-1/2 align-top">
                        <div className=' mb-5 flex'>
                            <span className='inline-block text-gray-800 text-xl flex-1'>{`${productDetailData.name}-${productDetailData.genderName}(${selectedSubproduct?.colorName || ""}-${selectedSize?.name || ""})`}</span>
                            <span className='inline-block text-red-500 font-black'>
                                <div className="inline-block text-md align-top">NT$</div>
                                <div className="inline-block text-4xl align-top ml-2">{selectedSubproduct?.price}</div>
                            </span>
                        </div>
                        <div className="border-t border-gray h-5 mb-5" />
                        <div className='mb-5'>
                            {subproducts.map(sp => (
                                <button
                                    onClick={() => handleSelectSubproduct(sp.id)}
                                    className={`w-8 h-8 mr-2 p-1 border ${selectedSubproduct?.id === sp.id ? 'border-black' : 'border-white'}`}
                                    key={sp.id}
                                >
                                    <img src={getColorImgUrlApi(sp.colorId)} alt={sp.colorName} />
                                </button>
                            ))}
                        </div>
                        <div className="mb-5">
                            {
                                selectedSubproduct &&
                                selectedSubproduct.sizes.map(size => (
                                    <button
                                        className={`py-1 px-7 mr-3 bg-slate-200 border ${selectedSize?.id === size.id ? 'border-black' : 'border-white'}`}
                                        onClick={() => handleSelectSize(size)}
                                        key={size.id}>
                                        {size.name}
                                    </button>))
                            }
                        </div>
                        <div className="text-right text-md mb-5">
                            <span className='mx-3'>評價</span>
                            <span className='mx-3'>產品說明與尺寸表</span>
                            <span className='mx-3'>收藏商品</span>
                        </div>
                        <div className="border-t border-gray mb-5" />
                        <div className='flex items-center mb-4'>
                            <span className='mr-3'>數量</span>
                            <span className="flex flex-nowrap border border-gray-400 mr-6">
                                <button className="bg-gray-200 hover:bg-white h-8 w-5 flex items-center justify-center" onClick={() => setBuyNum(buyNum <= 0 ? 0 : buyNum - 1)}>-</button>
                                <input className='text-center h-8 w-7 border-x border-gray-400' value={buyNum}
                                    onChange={e => {
                                        const numVal = Number(e.target.value)
                                        Number.isInteger(numVal) &&
                                            setBuyNum(numVal)
                                    }} type='text' />
                                <button className="bg-gray-200 hover:bg-white h-8 w-5 flex items-center justify-center" onClick={() => setBuyNum(buyNum + 1)}>+</button>
                            </span>
                            <button className="h-8  w-48 text-white bg-logo text-center">加入購物車</button>
                        </div>
                        <div className=' text-red-500 text-xs'>
                            APP獨享！超取滿680免運費
                        </div>
                    </div>
                </div>
                {
                    imgFileNameList.current.map(imgName => (
                        <div className='w-full mb-4 flex justify-center' key={imgName}>
                            <img src={getProductImgUrlApi(productDetailData.id, imgName)} />
                        </div>
                    ))
                }
            </div>
    )
}