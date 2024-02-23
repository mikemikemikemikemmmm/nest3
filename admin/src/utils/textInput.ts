import { FAKE_ID_FOR_CREATE } from "@/const"

export const checkPositiveInt = (val: unknown) => {
    const numVal = typeof val === "number" ? val : Number(val)
    return Number.isInteger(numVal) && numVal > 0
}
export const isInputValid = (typedVal: string | number, type: "string" | "number") => {
    if (type === "string") {
        if (typedVal === "") {
            return false
        }
        return true
    } else {
        return (typedVal as number) > 0 && Number.isInteger(typedVal)
    }
}

export const isModalAllInputValid = (
    inputData: object,
    errorsRef: React.MutableRefObject<{
        [key: string]: boolean;
    }>) => {
    return Object.entries(inputData).every(entry => {
        const key = entry[0]
        const val = entry[1]
        if (Array.isArray(val)) {
            return true
        }
        if (key === "imageFile") {
            return true
        }
        if (key === "id" && val === FAKE_ID_FOR_CREATE) {
            return true
        }
        //@ts-ignore
        if (!isInputValid(val, typeof (inputData[key]))) {
            errorsRef.current[key] = true
            return false
        } else {
            errorsRef.current[key] = false
            return true
        }
    })
}