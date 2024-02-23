import { useDispatch } from "react-redux"
import { useRef, useState } from "react"
import { dispatchError } from "../../utils/errorHandler"
import { createColorAPi, updateColorApi } from "../../api/entity"
import { Box, Button, IconButton, TextField } from "@mui/material"
import { FieldWrapper } from "../../component/fieldWrapper"
import { ProductWithStock, SubproductWithStock } from "@/api/page/stock"
import { getColorImageUrlApi, getImgUrlBySubProductIdApi } from "@/api/staticFile"
type InputData = {
    stockId: number,
    stock: number,
    sizeName: string
}[]
export interface ModalDataProp extends ProductWithStock {
    targetSubproductId: number
}
export const StockModal = (props: {
    modalDataProp: ModalDataProp,
    closeModal: () => void,
    forcedRender: () => void,
}) => {
    const { modalDataProp, forcedRender, closeModal } = props
    console.log(modalDataProp)
    const targetSubproduct = useRef<SubproductWithStock>(modalDataProp.subproducts
        .find(sp => sp.id === modalDataProp.targetSubproductId) as SubproductWithStock)
    if (!targetSubproduct.current) {
        return null
    }
    const [inputData, setInputData] = useState<InputData>(() => {
        return targetSubproduct.current.stocks
            .map(stock => {
                return {
                    stockId: stock.id,
                    stock: stock.stock,
                    sizeName: stock.sizeName
                }
            })
    })
    const resetStockInput = () => {
        const newInput = inputData.map((input, index) => {
            input.stock = targetSubproduct.current.stocks[index].stock
            return input
        })
        setInputData(newInput)
    }
    const handleSubmit = async () => {
        const validStock = inputData.every(input => Number.isInteger(input.stock) && input.stock >= 0)
        if (!validStock) {
            dispatchError("存貨不能為負數")
            return
        }
        //     const executeUpdate =
        //         await up(inputData, modalDataProp.id)
        //     if (executeUpdate?.isSuccess) {
        //         closeModal()
        //         forcedRender()
        //     }
        // }
    }
    const handleChangeStock = (inputIndex: number, type: "plus" | "minus") => {
        const newInputData = [...inputData]
        if (type === "plus") {
            newInputData[inputIndex].stock += 1
        } else {
            if (newInputData[inputIndex].stock <= 0) {
                return
            }
            newInputData[inputIndex].stock -= 1
        }
        setInputData(newInputData)
    }
    return (
        <>
            <div style={{display:"flex",alignItems:"start"}}>
                <span style={{ width: "50%", display: "inline-block" }}>
                    <img style={{ width: "100%"}} src={getImgUrlBySubProductIdApi(modalDataProp.targetSubproductId)} />
                </span>
                <span style={{ width: "50%", display: "inline-block" }}>
                    <Box margin={1}>名稱：{modalDataProp.name}-{modalDataProp.genderName}</Box>
                    <Box margin={1} display={"flex"} alignItems={"center"}>
                    顏色：{targetSubproduct.current.colorName} 
                        <img
                            style={{ height: 18 }}
                            src={getColorImageUrlApi(targetSubproduct.current.colorId)}
                        />
                    </Box>
                    <Box margin={1}>種類：{modalDataProp.navigationName}</Box>
                    {
                        inputData?.map((stockInput, index) => (
                            <Box margin={1} display={"flex"} key={stockInput.stockId}>
                                <span>{stockInput.sizeName}存貨量</span>
                                <span style={{display:"inline-block",height:"fit-content", whiteSpace: "nowrap", marginLeft: "auto" , border: "1px solid black"}}>
                                    <Box sx={{":hover":{backgroundColor:"black",color:"white"},userSelect:"none", display:"inline-flex",alignItems:"center",justifyContent:"center",m:0,p:0,width:"16px",cursor:"pointer",border:0}}   onClick={() => handleChangeStock(index, "plus")}>+</Box>
                                    <span style={{  borderLeft: "1px solid black", borderRight: "1px solid black", width: 32 ,display:"inline-flex" ,alignItems:"center",justifyContent:"center"}}>{stockInput.stock}</span>
                                    <Box sx={{":hover":{backgroundColor:"black",color:"white"},userSelect:"none", display:"inline-flex",alignItems:"center",justifyContent:"center",m:0,p:0,width:"16px",cursor:"pointer",border:0}}   onClick={() => handleChangeStock(index, "minus")}>-</Box>
                                </span>
                            </Box>
                        ))
                    }
                </span>
            </div>
            <div style={{ textAlign: "center" }}>
                <Button sx={{ marginX: 1 }} size="small" variant="contained" onClick={() => handleSubmit()}>
                    送出
                </Button>
                <Button sx={{ marginX: 1 }} size="small" variant="contained" onClick={() => resetStockInput()}>
                    重置
                </Button>
            </div>
        </>
    )
}
