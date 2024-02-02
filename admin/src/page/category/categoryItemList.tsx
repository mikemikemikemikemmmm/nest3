// import { useState } from "react"

// export function CategoryItemList(props: {
//     data: ResAllCategoryType[] | undefined,
//     type: NavType,
//     nowSelectedItem: { id: number } | undefined,
//     parentId: number,
//     selectFn: (id: number, type: NavType) => void,
//     toggleToRenderFn: () => void,
// }) {
//     const { data, type, nowSelectedItem, selectFn, parentId = -1, toggleToRenderFn } = props
//     const [isShowModal, setIsShowModal] = useState(false)
//     const [modalData, setModalData] = useState<ModalData | undefined>(undefined)
//     const closeModal = () => {
//         setModalData(undefined)
//         setIsShowModal(false)
//     }
//     const handleEdit = (modalData: ModalData) => {
//         setModalData(modalData)
//         setIsShowModal(true)
//     }
//     const handleCreate = () => {
//         setModalData(undefined)
//         setIsShowModal(true)
//     }
//     const handleDelete = async (id: number) => {
//         if (!confirm('確定要刪除嗎')) {
//             return
//         }
//         if (!data) {
//             dispatchError('刪除發生錯誤')
//             return
//         }
//         const target = data.find(item => item.id === id)
//         if (!target) {
//             dispatchError('刪除發生錯誤')
//             return
//         }
//         if (target.children && target.children.length > 0) {
//             dispatchError('不可刪除還有子元素的分類')
//             return
//         }
//         const targetApi = (() => {
//             switch (type) {
//                 case 'nav':
//                     return deleteOneByIdApi(EntityName.Nav,id)
//                 case 'category':
//                     return deleteOneByIdApi(EntityName.Category,id)
//                 case 'subCategory':
//                     return deleteOneByIdApi(EntityName.SubCategory,id)
//                 case 'series':
//                     return deleteOneByIdApi(EntityName.Series,id)
//             }
//         })
//         const response = await targetApi()
//         if (response.error) {
//             return
//         }
//         toggleToRenderFn()
//     }
//     const renderModal = () => {
//         return (
//             <ModalContainer closeFn={closeModal} isOpen={isShowModal}>
//                 <Stack spacing={2}>
//                     <CategoryPageModal
//                         type={type}
//                         parentId={parentId}
//                         modalData={modalData}
//                         closeModalFn={closeModal}
//                         toggleToRenderFn={toggleToRenderFn}
//                     />
//                 </Stack>
//             </ModalContainer>)
//     }
//     const hasParent = (listData: typeof data) => {
//         return Array.isArray(listData)
//     }
//     const hasData = (listData: typeof data) => {
//         return Array.isArray(listData) && listData.length > 0
//     }
//     return (
//         <>
//             {
//                 isShowModal && renderModal()
//             }
//             <Card>
//                 <CardContent>
//                     <List>
//                         <ListItem dense={true} disablePadding>
//                             <ListItemText sx={{ textAlign: 'center' }} primary={mapTypeName[type]} />
//                         </ListItem>
//                         {
//                             hasParent(data) ?
//                                 <ListItem dense={true} disablePadding >
//                                     <ListItemButton onClick={() => handleCreate()}>
//                                         <ListItemText primary='新增' />
//                                     </ListItemButton>
//                                 </ListItem> : null
//                         }
//                         {
//                             hasData(data) ? (data as ResAllCategoryType[]).map(item => (
//                                 <ListItem dense={true} disablePadding key={item.id}
//                                     secondaryAction={
//                                         <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item.id)}>
//                                             <DeleteIcon />
//                                         </IconButton>
//                                     }
//                                 >
//                                     <ListItemButton
//                                         onClick={() => selectFn(item.id, type)}
//                                         onDoubleClick={() => handleEdit(item)}
//                                         selected={nowSelectedItem?.id === item.id}

//                                     >
//                                         <ListItemText primary={item.name} />
//                                     </ListItemButton>
//                                 </ListItem>))
//                                 :
//                                 <ListItem dense={true} disablePadding >
//                                     <ListItemText sx={{ textAlign: 'center' }} primary={'無資料'} />
//                                 </ListItem>
//                         }
//                     </List>
//                 </CardContent>
//             </Card >
//         </>
//     );
// }