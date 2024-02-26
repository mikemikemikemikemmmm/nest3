import React, { useEffect } from 'react'
import { Link, useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { NavigationTree } from '../api/get'
import { useSelector } from 'react-redux'
import { NavigationState, useAppSelector } from '../store'
import { useGetMenuRoute } from '../utils'
export const AsideComponent = (props: { menuRoute: string }) => {
    const { menuRoute } = props
    const navigationTree = useAppSelector(s => s.navSlice.navigationTree) as NavigationTree[]
    const currentMenu = navigationTree.find(menu => menu.route === menuRoute)
    if (!currentMenu) {
        return <aside
            className="align-top inline-block list-none text-aside w-aside"
        />
    }
    const asideData = currentMenu.children
    return (
        <aside
            className="align-top inline-block list-none text-aside w-aside"
        >
            <ul>
                {
                    asideData
                        .filter(category => category.children.length > 0)
                        .map(category => <ul className='mb-6' key={category.id}>
                            <li>
                                <h2 className='text-lg font-bold from-neutral-900'>
                                    <span className="inline-block">。</span>
                                    {category.name}
                                </h2>
                                <ul>
                                    {category.children.map(subcategory =>
                                        <li
                                            key={subcategory.id}
                                            className="my-2 text-lg hover:underline hover:text-asideHover">
                                            <Link
                                                key={subcategory.id}
                                                to={`/${menuRoute}/${category.route}/${subcategory.route}`}>
                                                <span className="inline-block">＞</span>
                                                {subcategory.name}
                                            </Link>
                                        </li>)}
                                </ul>
                            </li>
                        </ul>)
                }
            </ul>
        </aside>
    )
}