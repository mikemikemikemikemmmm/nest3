export const getEnitiyApiPrefix=(entityClass):string=>{
    return `admin/entity/${entityClass.name}`
}
export const getEnitiyName=(entityClass):string=>{
    return entityClass.name
}