import { NavigationData } from './api/get'
import './style/index.css'
import { MenuNavigation } from './component/nav'
import { Outlet, useLoaderData } from 'react-router-dom'
import { AsideComponent } from './component/aside'
function App() {
    const { navigationData ,menuRoute} = useLoaderData() as { navigationData: NavigationData[],menuRoute?:string }
    if (navigationData.length === 0) {
        return <div></div>
    }
    return (
        <div className="w-screen h-screen">
            <MenuNavigation menuRoute={menuRoute} navigationData={navigationData} />
            <div className="flex">
                <AsideComponent navigationData={navigationData} />
                <span className="flex-grow">
                    <Outlet />
                </span>
            </div>
        </div >
    )

}

export default App
