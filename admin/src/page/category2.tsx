import { useEffect, useState } from "react"
import { ResNav } from "../api/get"

const CategoryEditPage = () => {
    const [allData, setAllData] = useState<ResNav[] | []>([])
    const [toggleToRender, setToggleToRender] = useState<boolean>(false)
    const forcedRender = () => {
        setToggleToRender(!toggleToRender)
    }
    const getAllData = async () => {
        const { result, error } = await getAllNavDataForCategoryPageApi()
        if (error || !result) {
            return
        }
        setAllData(result)
    }
    useEffect(() => {
        getAllData()
    }, [toggleToRender])

    const [currentNav, setCurrentNav] = useState<ResNav>(undefined)
    const [currentSubCategory, setCurrentSubCategory] = useState<ResNav>(undefined)
    return (<section>
        <section>
            {
                allData.map(nav =>
                    <span key={nav.id} onClick={() => handleClickNav(nav)}>
                        {nav.name}
                    </span>)
            }
            <span onClick={() => handleCreateNav()}>
                新增
            </span>
        </section>
        <section>
            <aside>
                {
                    currentNav.children.map(category =>
                        <ul key={category.id}>
                            <li>
                                {category.name}
                            </li>
                            <li onClick={() => handleCreateCategory()}>
                                新增種類
                            </li>
                            <li>
                                {
                                    category.children.map(subCategory =>
                                        <li>
                                            {subCategory.name}
                                        </li>)
                                }
                            </li>
                            <li onClick={() => handleCreateSubCategory()}>
                                新增副種類
                            </li>
                        </ul>)
                }
            </aside>
            <section>
                
            </section>
        </section>
    </section>)
}