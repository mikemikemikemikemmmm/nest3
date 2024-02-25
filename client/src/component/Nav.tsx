import { Link, NavLink, useLoaderData, useLocation, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { NavigationTree, getProductMenuRouteApi } from '../api/get';
import { NavigationState, useAppSelector } from '../store';
import { useGetMenuRoute } from '../utils';

export const MenuNavigation = (props: { navigationTree: NavigationTree[] }) => {
    const menuRoute = useGetMenuRoute()
    return (
        <>
            <div className="h-10"/>
            <nav className="w-full items-end mb-6" >
                <Link to={'/'} className=" text-logo inline-block w-aside text-5xl">
                    lativ
                </Link>
                <div className='inline-block text-lg'>
                    {props.navigationTree
                        // .filter(menu => {
                        //     if (menu.children.length === 0) {
                        //         return false
                        //     }
                        //     if (menu.children.every(category => category?.children?.length === 0)) {
                        //         return false
                        //     }
                        //     return true
                        // })
                        .map((menu, i) => (
                            <span
                                key={menu.id}
                                className="inline-block">
                                <Link className={
                                    `inline-block text-center w-32 py-1 hover:text-nav-hover
                                ${menuRoute === menu.route ? "bg-nav-actived_bg text-nav-hover" : "text-nav-text"}
                                `
                                }

                                    to={`/${menu.route}`}
                                >
                                    {menu.name}
                                </Link>
                                {
                                    i === props.navigationTree.length - 1 ||
                                    <span >
                                        |
                                    </span>
                                }
                            </span>))}
                </div>
            </nav>
        </>
    )
}