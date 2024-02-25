import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { dispatchError, dispatchSuccess } from "../utils/errorHandler"
import { getToken, setToken } from "../utils/token"
import { loginApi, testTokenApi } from "@/api/page/login"

export const LoginPage = () => {
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const handleLogin = async () => {
        if (!password || !email) {
            dispatchError('信箱與密碼不得為空')
            return
        }
        const login = await loginApi({ email, password })
        if (login.isSuccess) {
            dispatchSuccess('登入成功')
            navigate("/color")
        }
    }
    const testToken = async () => {
        // const test = await testTokenApi()
        // if(test.isSuccess){
        //     navigate("/color")
        // }
    }
    useEffect(() => {
        testToken()
    }, [])
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: "center",
            height: "100%"
        }}>
            <div style={{ padding: 20 }}>
                <input type="text" style={{ display: 'block', padding: 10, margin: 10 }} placeholder="信箱" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" style={{ display: 'block', padding: 10, margin: 10 }} placeholder="密碼" onChange={(e) => setPassword(e.target.value)} />
                <div style={{ textAlign: 'center' }}>
                    <button style={{ padding: 10, margin: 10, textAlign: 'center' }} onClick={() => handleLogin()}>
                        送出
                    </button>
                </div>
            </div>
        </div >
    )
}