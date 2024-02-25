import './style/index.css'
import { MenuNavigation } from './component/nav'
import { Outlet } from 'react-router-dom'
import { NavigationTree, getNavigationTreeApi } from './api/get'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNavigationTree } from './store'
import { Wrapper } from './component/wrapper'
function App() {
    const [navigationTree, _setNavigationTree] = useState<NavigationTree[]>([])
    const dispatch = useDispatch()
    const getNavigationTree = async () => {
        const get = await getNavigationTreeApi()
        if (get.isSuccess) {
            _setNavigationTree(get.data)
            dispatch(setNavigationTree(get.data))
        }
    }
    useEffect(() => {
        getNavigationTree()
    }, [])
    if (navigationTree.length === 0) {
        return null
    }
    return (
        <Wrapper>
            <>
                <MenuNavigation navigationTree={navigationTree} />
                <Outlet />
            </>
        </Wrapper>
    )

}

export default App
