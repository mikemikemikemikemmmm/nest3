import { Link, NavLink, useLoaderData, useLocation, useParams } from 'react-router-dom'
import { NavigationData } from '../api/get'
import { useEffect, useState } from 'react';

export const MenuNavigation = (props: { navigationData: NavigationData[]}) => {
    const location = useLocation();
    const [menuRoute, setMenuRoute] = useState();

    useEffect(() => {
        // execute on location change
        console.log('Location changed!', location); //TODO
    }, [location]);
    return (
        <nav className="w-full flex items-end h-24 mb-4" >
            <Link to={'/'} style={{ fontSize: 48 }}>
                lativ
            </Link>
            <div className='pb-4 ml-24 text-lg'>
                {props.navigationData
                    .filter(nav => {
                        if (nav.children.length === 0) {
                            return false
                        }
                        if (nav.children.every(category => category?.children?.length === 0)) {
                            return false
                        }
                        return true
                    })
                    .map(menu => (
                        <NavLink
                            // style={{ backgroundColor: loaderData?.navRoute === nav.route ? '#F0EDE5' : 'white' }} key={nav.id}
                            className={({ isActive }) =>
                                `inline-block w-32 text-center py-1 hover:bg-amber-300 hover:text-slate-800
                                ${(isActive)?"bg-slate-500":""}
                                `
                            }
                            key={menu.id}
                            to={`/${menu.route}`}
                        >
                            {menu.name}
                        </NavLink>))}
            </div>
        </nav>
    )
}