// export type NavType = EntityName.Nav |EntityName.Category|EntityName.SubCategory|EntityName.Series
// // const mapTypeName = {
// //     'nav': "導覽行",
// //     'category': '大分類',
// //     'subCategory': '小分類',
// //     'series': "全系列"
// // } as Record<NavType, string>
// export type ModalData = {
//     id: number,
//     name: string,
//     sort: number,
//     route?: string
// }
// export const CategoryPage = () => {
//     const [data, setData] = useState<ResNav[] | []>([])
//     const [productCardData, setProductCardData] = useState<ResProductCard[]>([])
//     const [selectedNav, setSelectedNav] = useState<ResNav | undefined>(undefined)
//     const [selectedCategory, setSelectedCategory] = useState<ResCategory | undefined>(undefined)
//     const [selectedSubCategory, setSelectedSubCategory] = useState<ResSubcategory | undefined>(undefined)
//     const [selectedSeries, setSelectedSeries] = useState<ResSeries | undefined>(undefined)
//     const [toggleToRender, setToggleToRender] = useState<boolean>(false)
//     const forcedRender = () => {
//         setToggleToRender(!toggleToRender)
//     }
//     const closeModal = () => {
//         setModalDataProp(getEmptyColorModalData())
//         setIsModalShow(false)
//     }
//     const handleCreate=()=>{
//         setModalDataProp(getEmptyColorModalData())
//         setIsModalShow(true)
//     }
//     const handleEditColor = (colorModalData: ColorModalData) => {
//         setModalDataProp(colorModalData)
//         setIsModalShow(true)
//     }
//     const getAllData = async () => {
//         const { result, error } = await getAllNavDataForCategoryPageApi()
//         if (error || !result) {
//             return
//         }
//         setData(result)
//     }
//     useEffect(() => {
//         getAllData()
//     }, [toggleToRender])
//     useEffect(() => {
//         const nowSelectedIdStatus = {
//             nav: selectedNav?.id,
//             category: selectedCategory?.id,
//             subCategory: selectedSubCategory?.id,
//             series: selectedSeries?.id,
//         }
//         const { nav, category, subCategory, series } = nowSelectedIdStatus
//         const targetNav = data.find(n => n.id === nav)
//         setSelectedNav(targetNav)
//         const targetCategory = targetNav?.children?.find(c => c.id === category)
//         setSelectedCategory(targetCategory)
//         const targetSubCategory = targetCategory?.children?.find(sc => sc.id === subCategory)
//         setSelectedSubCategory(targetSubCategory)
//         const targetSeries = targetSubCategory?.children?.find(s => s.id === series)
//         setSelectedSeries(targetSeries)
//     }, [data])
//     const handleSelectLiItem = async (id: number, type: NavType) => {
//         let target: ResAllCategoryType | undefined = undefined
//         switch (type) {
//             case 'nav':
//                 target = data.find(nav => nav.id === id)
//                 setSelectedNav(target)
//                 setSelectedCategory(undefined)
//                 setSelectedSubCategory(undefined)
//                 setSelectedSeries(undefined)
//                 break;
//             case 'category':
//                 target = selectedNav?.children.find(category => category.id === id)
//                 setSelectedCategory(target)
//                 setSelectedSubCategory(undefined)
//                 setSelectedSeries(undefined)
//                 break;
//             case 'subCategory':
//                 target = selectedCategory?.children.find(subcategory => subcategory.id === id)
//                 setSelectedSubCategory(target)
//                 setSelectedSeries(undefined)
//                 break;
//             case 'series':
//                 target = selectedSubCategory?.children.find(series => series.id === id)
//                 setSelectedSeries(target)
//                 break;
//         }
//         if (type === 'series') {
//             const { error, result } = await getProductCardDataBySeriesIdApi(id)
//             if (error || !result) {
//                 dispatchError('抓取產品資料時發生錯誤')
//             } else {
//                 setProductCardData(result)
//             }
//         } else {
//             setProductCardData([])
//         }
//     }
//     if (data.length === 0) {
//         return <div className=""></div>
//     }
//     return (
//         <Container>
//             <Grid container columns={8} spacing={3}>
//                 <Grid item md={2} sm={4} xs={8} sx={{ height: '100%' }}>
//                     <Ul
//                         type='nav'
//                         data={data}
//                         nowSelectedItem={selectedNav}
//                         selectFn={handleSelectLiItem}
//                         parentId={-1}
//                         forcedRender={forcedRender}
//                     />
//                 </Grid>
//                 <Grid item md={2} sm={4} xs={8} sx={{ height: '100%' }}>
//                     <Ul
//                         type='category'
//                         data={selectedNav?.children}
//                         nowSelectedItem={selectedCategory}
//                         selectFn={handleSelectLiItem}
//                         parentId={selectedNav?.id || -1}
//                         forcedRender={forcedRender}
//                     />
//                 </Grid>
//                 <Grid item md={2} sm={4} xs={8} sx={{ height: '100%' }}>
//                     <Ul
//                         type='subCategory'
//                         data={selectedCategory?.children}
//                         nowSelectedItem={selectedSubCategory}
//                         selectFn={handleSelectLiItem}
//                         parentId={selectedCategory?.id || -1}
//                         forcedRender={forcedRender}
//                     />
//                 </Grid>
//                 <Grid item md={2} sm={4} xs={8} sx={{ height: '100%' }}>
//                     <Ul
//                         type='series'
//                         data={selectedSubCategory?.children}
//                         nowSelectedItem={selectedSeries}
//                         selectFn={handleSelectLiItem}
//                         parentId={selectedSubCategory?.id || -1}
//                         forcedRender={forcedRender}
//                     />
//                 </Grid>
//                 <Grid xs={8} item container columns={12} >
//                     {productCardData.length === 0 ?
//                         <Grid item xs={12} >無產品資料</Grid>
//                         :
//                         productCardData.map(pc => (
//                             <Grid item xs={3} >
//                                 <ProductCard key={pc.id} id={pc.id} name={pc.name} first_subproduct_id={pc.first_subproduct_id} />
//                             </Grid>)
//                         )
//                     }
//                 </Grid>
//             </Grid>
//         </Container >
//     )
// }