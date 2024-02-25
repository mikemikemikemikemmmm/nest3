import {  HasIdMixin } from "src/entity/entity";
import { DataSource } from "typeorm";
import { EntityTarget } from "typeorm/common/EntityTarget";
import { getEnitiyName } from "./utils";
import { EditingException } from "src/exception/editingException";
export class BaseService {
    static async getMany(ds: DataSource, entityTarget: EntityTarget<HasIdMixin>) {
        return await ds.manager.find(entityTarget)
    }
    static async getById(id: string, ds: DataSource, entityTarget: EntityTarget<HasIdMixin>) {
        const item = await ds.manager.findOneByOrFail(entityTarget, { id: +id })
        return item
    }
    // static async getEditing(id: string, ds: DataSource, entityTarget: EntityTarget<HasIdMixin>) {
    //     const editing = await ds.manager.findOneBy(Editing, {
    //         targetEntity: getEnitiyName(entityTarget),
    //         targetId: +id
    //     })
    //     if (editing) {
    //         const { user, targetEntity, targetId } = editing
    //         throw new EditingException(user.email, targetEntity, targetId);
    //     }
    // }
    static async checkHasIdAndNotEditing(id: string, ds: DataSource, entityTarget: EntityTarget<HasIdMixin>) {
        await BaseService.getById(id, ds, entityTarget)
        // await BaseService.getEditing(id, ds, entityTarget)
    }
    static async deleteById(id: string, ds: DataSource, entityTarget: EntityTarget<HasIdMixin>) {
        await BaseService.checkHasIdAndNotEditing(id, ds, entityTarget)
        await ds.manager.delete(entityTarget, { id: +id })
    }
    static async updateById<UpdateDto>(id: string, ds: DataSource, entityTarget: EntityTarget<HasIdMixin>, dto: UpdateDto) {
        await BaseService.checkHasIdAndNotEditing(id, ds, entityTarget)
        await ds.manager.update(entityTarget, { id: +id }, dto)
    }
    static async insertOne<CreateDto>(ds: DataSource, entityTarget: EntityTarget<HasIdMixin>, dto: CreateDto) {
        await ds.manager.insert(entityTarget, dto)
    }
}