import React, { useEffect } from 'react'
import { Link, useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { ASIDE_WIDTH } from '../style/const'
import { NavigationData } from '../api/get'
export const AsideComponent = (props: { navigationData: NavigationData[] }) => {
    const { navRoute } = useParams()
    if (!navRoute || navRoute === "") {
        return null
    }
    const currentNav = props.navigationData.find(n => n.route === navRoute)
    if (!currentNav || currentNav.children.length === 0) {
        return null
    }
    const asideData = currentNav.children
    return (
        <aside
            className=" align-top inline-block list-none text-aside"
            style={{ width: ASIDE_WIDTH }}
        >
            <ul>
                {
                    asideData
                        .filter(category => category.children.length > 0)
                        .map(category => <ul key={category.id}>
                            <li>
                                <h2 className='text-sm font-bold from-neutral-900'> {category.name}</h2>
                                <ul>
                                    {category.children.map(subcategory =>
                                        <li
                                            key={subcategory.id}
                                            className="my-2  hover:underline hover:text-asideHover">
                                            <Link
                                                key={subcategory.id}
                                                to={`/${currentNav.route}/${category.route}/${subcategory.route}`}>
                                                {`  > ${subcategory.name}`}
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