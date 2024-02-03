import { useEffect, useState } from "react"
import { EntityName, deleteOneByIdApi } from "../../api/entity"
import { FAKE_ID_FOR_CREATE } from "../../const"
import { NavigationItem } from "./navigationItem"
import { Category } from "@mui/icons-material"
import { ModalContainer } from "../../component/modalContainer"
import { Stack } from "@mui/material"
import { NavigationModal, NavigationModalData } from "./modal"
import { NavigationTreeItem, NavigationTreeItemType, SeriesTreeItem, getNavigationTreeApi, getSeriesTreeBySubCategoryIdApi } from "../../api/page/navigation"
const getEmptyModalData = (type: NavigationTreeItemType, parentId: number) => ({
    id: FAKE_ID_FOR_CREATE,
    name: "",
    order: 0,
    type,
    parentId,
})
export const NavigationPage = () => {
    const [navigationTreeData, setNavigationTreeData] = useState<NavigationTreeItem[] | undefined>(undefined)
    const [selectedMenu, setSelectedMenu] = useState<NavigationTreeItem | undefined>(undefined)
    const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<number | undefined>(undefined)
    const [seriesTreeData, setSeriesTreeData] = useState<SeriesTreeItem[]>([])
    const [isModalShow, setIsModalShow] = useState(false)
    const [modalDataProp, setModalDataProp] = useState<NavigationModalData>(() => getEmptyModalData(EntityName.Menu, FAKE_ID_FOR_CREATE))
    const handleEdit = (treeItem: NavigationTreeItem) => {
        setModalDataProp(treeItem)
        setIsModalShow(true)
    }
    const handleCreate = (type: NavigationTreeItemType, parentId: number) => {
        setModalDataProp(getEmptyModalData(type, parentId))
        setIsModalShow(true)
    }
    const handleDelete = async (id: number, type: NavigationTreeItemType) => {
        if (confirm('確定刪除嗎')) {
            const executeDelete = await deleteOneByIdApi(type, id)
            if (!executeDelete.error) {
                // forcedRender() TODO
            }
        }
    }
    const closeModal = () => {
        setModalDataProp(getEmptyModalData(EntityName.Menu, FAKE_ID_FOR_CREATE))
        setIsModalShow(false)
    }
    const handleSelect = (type: NavigationTreeItemType, dataRef: NavigationTreeItem) => {
        switch (type) {
            case EntityName.Menu:
                setSelectedMenu(dataRef)
                break;
            case EntityName.SubCategory:
                setSelectedSubCategoryId(dataRef.id)
                break;
        }
    }
    const renderModal = () => {
        if (isModalShow) {
            return null
        }
        return (
            <ModalContainer closeFn={closeModal} isOpen={true}>
                <Stack spacing={2}>
                    <NavigationModal
                        modalDataProp={modalDataProp}
                        closeModal={closeModal}
                    />
                </Stack>
            </ModalContainer>)
    }
    const getSeriesTree = async () => {
        if (selectedSubCategoryId === undefined) {
            return
        }
        const { result } = await getSeriesTreeBySubCategoryIdApi(selectedSubCategoryId)
        if (result) {
            setSeriesTreeData(result)
        }
    }
    const getNavigationTree = async () => {
        const { result } = await getNavigationTreeApi()
        if (result) {
            setNavigationTreeData(result)
        }
    }
    useEffect(() => {
        getSeriesTree()
    }, [selectedSubCategoryId])
    useEffect(() => {
        getNavigationTree()
    }, [])
    return <section>
        {renderModal()}
        <div>
            <button onClick={() => handleCreate(EntityName.Menu, FAKE_ID_FOR_CREATE)}></button>
            {
                navigationTreeData?.map(menu =>
                    <NavigationItem
                        key={menu.id}
                        data={menu}
                        handleSelect={handleSelect}
                        handleDelete={handleDelete}
                        handleEdit={handleEdit} />
                )
            }
        </div>
        <div>
            <aside>
                <button onClick={() => handleCreate(EntityName.Category, FAKE_ID_FOR_CREATE)}>
                    新增種類
                </button>
                {
                    selectedMenu?.children.map(category =>
                        <>
                            <div>
                                <NavigationItem
                                    key={category.id}
                                    data={category}
                                    handleSelect={handleSelect}
                                    handleDelete={handleDelete}
                                    handleEdit={handleEdit} />
                            </div>
                            <button onClick={() => handleCreate(EntityName.SubCategory, FAKE_ID_FOR_CREATE)}>
                                新增副種類
                            </button>
                            {
                                category.children.map(subCategory =>
                                    <NavigationItem
                                        key={subCategory.id}
                                        data={subCategory}
                                        handleSelect={handleSelect}
                                        handleDelete={handleDelete}
                                        handleEdit={handleEdit} />)
                            }
                        </>
                    )
                }

            </aside>
            <div>
                {seriesTreeData.map(series => <div key={series.id}>
                    {series.name}
                </div>)}
            </div>
        </div>
    </section>
}