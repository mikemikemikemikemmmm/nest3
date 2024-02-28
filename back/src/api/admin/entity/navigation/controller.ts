
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseFilePipeBuilder, Post, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { PartialType } from "@nestjs/mapped-types";
import { unlink, writeFile } from "fs/promises";
import { IsIn, IsInt, IsString, isIn, validate } from "class-validator";
import { DataSource, IsNull, Not } from "typeorm";
import { BaseService } from "../baseService";
import { getEnitiyApiPrefix } from "../utils";
import { Navigation, Series } from "src/entity/entity";
import { getMenuBannerImageFilePath } from "src/config/env";
import { COLOR_IMG_MAX_SIZE, KEY_FOR_STRINGIGY_FORM_DATA, KEY_FOR_UPLOAD_IMAGE_FORM_DATA, MENU_BANNER_IMG_MAX_SIZE, MENU_BANNER_IMG_WIDTH } from "src/const";
import { FormDataBody } from "src/type";
import { FileInterceptor } from "@nestjs/platform-express";
// import { HandleNavDataCacheInterceptor } from "src/Interceptor/handleNavCacheInterceptor";

class CreateDto {
    @IsString()
    name: string
    @IsInt()
    order: number
    @IsString()
    route: string
    @IsIn(["menu", "category", "subCategory"])
    type: string
    @IsInt()
    parentId: number
}
enum NavigationItemType {
    Menu = "menu",
    Category = "category",
    Subcategory = "subCategory"
}
class UpdateDto extends PartialType(CreateDto) { }
@Controller(getEnitiyApiPrefix(Navigation))
export class _Controller {
    constructor(
        private ds: DataSource,
    ) { }
    static getNavigationType(data: Navigation) {
        if (data.subCategoryId) {
            return NavigationItemType.Subcategory
        }
        if (data.categoryId) {
            return NavigationItemType.Category
        }
        return NavigationItemType.Menu
    }
    @Get("category")
    async getCategorys() {
        return await this.ds.manager
            .findBy(Navigation, { subCategoryId: IsNull(), categoryId: Not(IsNull()) })
    }
    @Get("menu")
    async getMenus() {
        return await this.ds.manager.findBy(Navigation, { subCategoryId: IsNull(), categoryId: IsNull() })
    }
    @Get("test")
    async getTreeTest() {
        const result = await this.ds.createQueryBuilder()
            .addSelect("n.menuId", "id")
            .addSelect("n.menuName", "name")
            .addSelect("n.menuRoute", "route")
            .addSelect("'menu'", "type")
            .addSelect(`json_group_array(
                json_object(
                    'id', categorys.id,
                    'name', categorys.name,
                    'route', categorys.route,
                    'type', categorys.type,
                    'children',categorys.children
                )
            )`, "children")
            .from(Navigation, "n")
            .where("n.categoryId IS NULL")
            .andWhere("n.subCategoryId IS NULL")
            .orderBy("n.menuOrder")
            .groupBy("categorys.menuId")
            .innerJoin(
                subQuery => {
                    return subQuery
                        .addSelect("n.categoryId", "id")
                        .addSelect("n.menuId", "menuId")
                        .addSelect("n.categoryName", "name")
                        .addSelect("n.categoryRoute", "route")
                        .addSelect("'category'", "type")
                        .addSelect(`json_group_array(
                            json_object(
                                'id', subCategorys.id,
                                'name', subCategorys.name,
                                'route', subCategorys.route,
                                'type', subCategorys.type
                            )
                        )`, "children")
                        .from(Navigation, "n")
                        .andWhere("n.subCategoryId IS NULL")
                        .andWhere("n.menuId IS NOT NULL")
                        .orderBy("n.categoryOrder")
                        .groupBy("subCategorys.categoryId")
                        .innerJoin(
                            subQuery => {
                                return subQuery
                                    .addSelect("n.subCategoryId", "id")
                                    .addSelect("n.categoryId", "categoryId")
                                    .addSelect("n.subCategoryName", "name")
                                    .addSelect("n.subCategoryRoute", "route")
                                    .addSelect("'subCategory'", "type")
                                    .from(Navigation, "n")
                                    .orderBy("n.subCategoryOrder")
                                    .where("n.subCategoryId IS NOT NULL")
                            },
                            "subCategorys",
                            "subCategorys.categoryId = n.categoryId")
                },
                "categorys",
                "categorys.menuId = n.menuId"
            )
            .getRawMany()
        result.forEach(menu => {
            menu["children"] = JSON.parse(menu["children"])
            menu["children"].forEach(category => {
                category["children"] = JSON.parse(category["children"])
            })
        })
        return result
    }
    @Get("tree")
    async getTreeData() {
        const allNav = await this.getAll()
        const result = []
        allNav.forEach((n: Navigation) => {
            const type = _Controller.getNavigationType(n)
            switch (type) {
                case NavigationItemType.Subcategory: {
                    const targetMenu = result.find(menu => menu.id === n.menuId)
                    if (!targetMenu) {
                        result.push({
                            id: n.menuId,
                            route: n.menuRoute,
                            name: n.menuName,
                            order: n.menuOrder,
                            type: NavigationItemType.Menu,
                            children: [
                                {
                                    id: n.categoryId,
                                    route: n.categoryRoute,
                                    name: n.categoryName,
                                    order: n.categoryOrder,
                                    type: NavigationItemType.Category,
                                    parentId: n.menuId,
                                    children: [{
                                        id: n.subCategoryId,
                                        route: n.subCategoryRoute,
                                        name: n.subCategoryName,
                                        order: n.subCategoryOrder,
                                        type: NavigationItemType.Subcategory,
                                        parentId: n.categoryId,
                                    }]
                                }
                            ]
                        })
                        return
                    }
                    const targetCategory = targetMenu.children
                        .find(category => category.id === n.categoryId)
                    if (!targetCategory) {
                        targetMenu.children.push({
                            id: n.categoryId,
                            route: n.categoryRoute,
                            name: n.categoryName,
                            order: n.categoryOrder,
                            type: NavigationItemType.Category,
                            parentId: n.menuId,
                            children: [{
                                id: n.subCategoryId,
                                route: n.subCategoryRoute,
                                name: n.subCategoryName,
                                order: n.subCategoryOrder,
                                type: NavigationItemType.Subcategory,
                                parentId: n.categoryId,
                            }]
                        })
                        return
                    }
                    targetCategory.children.push({
                        id: n.subCategoryId,
                        route: n.subCategoryRoute,
                        name: n.subCategoryName,
                        order: n.subCategoryOrder,
                        type: NavigationItemType.Subcategory,
                        parentId: n.categoryId,
                    })
                    return
                }
                case "category": {
                    const targetMenu = result.find(menu => menu.id === n.menuId)
                    if (!targetMenu) {
                        result.push({
                            id: n.menuId,
                            route: n.menuRoute,
                            name: n.menuName,
                            order: n.menuOrder,
                            type: NavigationItemType.Menu,
                            children: [
                                {
                                    id: n.categoryId,
                                    route: n.categoryRoute,
                                    name: n.categoryName,
                                    order: n.categoryOrder,
                                    type: NavigationItemType.Category,
                                    parentId: n.menuId,
                                    children: []
                                }
                            ]
                        })
                        return
                    }
                    targetMenu.children.push(
                        {
                            id: n.categoryId,
                            route: n.categoryRoute,
                            name: n.categoryName,
                            order: n.categoryOrder,
                            type: NavigationItemType.Category,
                            parentId: n.menuId,
                            children: []
                        })
                    return

                }
                case "menu": {
                    result.push({
                        id: n.menuId,
                        route: n.menuRoute,
                        name: n.menuName,
                        order: n.menuOrder,
                        type: NavigationItemType.Menu,
                        children: []
                    })
                    return
                }
            }
        })
        return result
    }
    @Get(":id")
    async getById(@Param("id") id: string) {
        return await BaseService.getById(id, this.ds, Navigation)
    }
    @Get()
    async getAll() {
        return await this.ds.manager.find(Navigation, { order: { menuOrder: "asc", categoryOrder: "asc", subCategoryOrder: "asc" } })
    }
    @Put("menu/:menuId")
    @UseInterceptors(FileInterceptor(KEY_FOR_UPLOAD_IMAGE_FORM_DATA))
    async updateMenu(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: 'image/jpeg',
                })
                .addMaxSizeValidator({
                    maxSize: MENU_BANNER_IMG_MAX_SIZE
                })
                .build({
                    fileIsRequired: false,
                    errorHttpStatusCode: 500
                }),
        )
        imageFile: Express.Multer.File,
        @Param("menuId") menuId: string,
        @Body() formDataBody: FormDataBody
    ) {
        const updateData = JSON.parse(formDataBody[KEY_FOR_STRINGIGY_FORM_DATA])
        const updateDto = new UpdateDto()
        Object.assign(updateDto, updateData)
        const dtoErrors = await validate(updateDto, { whitelist: true })
        if (dtoErrors.length > 0) {
            throw new HttpException("資料驗證錯誤", HttpStatus.UNPROCESSABLE_ENTITY)
        }
        const queryRunner = this.ds.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction();
        let errorStr
        try {
            await queryRunner.manager.update(Navigation,
                { menuId: +menuId },
                {
                    menuName: updateDto.name,
                    menuOrder: updateDto.order,
                    menuRoute: updateDto.route,
                })
            const hasFile = imageFile && imageFile.buffer.length !== 0
            if (hasFile) {
                const imageSavePath = getMenuBannerImageFilePath(menuId)
                await writeFile(imageSavePath, imageFile.buffer)
            }
            await queryRunner.commitTransaction()
        } catch (err) {
            errorStr = err
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
        if (errorStr) {
            throw new HttpException(errorStr, HttpStatus.CONFLICT)
        }
    }
    @Put(":itemId")
    async update(
        @Param("itemId") itemId: string,
        @Body() updateDto: UpdateDto
    ) {
        const { type } = updateDto
        switch (type) {
            case NavigationItemType.Subcategory: {
                return await this.ds.manager
                    .update(Navigation,
                        { subCategoryId: +itemId },
                        {
                            subCategoryName: updateDto.name,
                            subCategoryOrder: updateDto.order,
                            subCategoryRoute: updateDto.route,
                        })
            }
            case NavigationItemType.Category: {
                return await this.ds.manager
                    .update(Navigation,
                        { categoryId: +itemId },
                        {
                            categoryName: updateDto.name,
                            categoryOrder: updateDto.order,
                            categoryRoute: updateDto.route,
                        })
            }
            case NavigationItemType.Menu: {
                return await this.ds.manager
                    .update(Navigation,
                        { menuId: +itemId },
                        {
                            menuName: updateDto.name,
                            menuOrder: updateDto.order,
                            menuRoute: updateDto.route,
                        })
            }
        }
    }
    @Post("")
    async insert(
        @Body() createDto: CreateDto
    ) {
        const { type, parentId } = createDto
        let insertData
        switch (type) {
            case NavigationItemType.Subcategory: {
                const categoryParentData = await this.ds.manager
                    .findOneBy(Navigation, {
                        categoryId: parentId,
                        subCategoryId: IsNull()
                    })
                if (!categoryParentData) {
                    throw new HttpException("父元素不存在", HttpStatus.BAD_REQUEST)
                }
                const maxSubCategoryId =
                    await this.ds.manager.maximum(Navigation, "subCategoryId")
                insertData = {
                    menuId: categoryParentData.menuId,
                    menuName: categoryParentData.menuName,
                    menuRoute: categoryParentData.menuRoute,
                    menuOrder: categoryParentData.menuOrder,
                    categoryRoute: categoryParentData.categoryRoute,
                    categoryName: categoryParentData.categoryName,
                    categoryOrder: categoryParentData.categoryOrder,
                    categoryId: categoryParentData.categoryId,
                    subCategoryId: maxSubCategoryId + 1,
                    subCategoryRoute: createDto.route,
                    subCategoryName: createDto.name,
                    subCategoryOrder: createDto.order,
                }
                break
            }
            case NavigationItemType.Category: {
                const menuParentData = await this.ds.manager
                    .findOneBy(Navigation, {
                        menuId: parentId,
                        categoryId: IsNull(),
                        subCategoryId: IsNull()
                    })
                if (!menuParentData) {
                    throw new HttpException("父元素不存在", HttpStatus.BAD_REQUEST)
                }
                const maxCategoryId = await this.ds.manager.maximum(Navigation, "categoryId")
                insertData = {
                    menuId: menuParentData.menuId,
                    menuName: menuParentData.menuName,
                    menuRoute: menuParentData.menuRoute,
                    menuOrder: menuParentData.menuOrder,
                    categoryRoute: createDto.route,
                    categoryName: createDto.name,
                    categoryOrder: createDto.order,
                    categoryId: maxCategoryId + 1
                }
                break
            }
            // case NavigationItemType.Menu: {
            //     const hasSameRouteMenu = await this.ds.manager
            //         .findBy(Navigation, {
            //             menuRoute: createDto.route,
            //             categoryId: IsNull(),
            //             subCategoryId: IsNull()
            //         })
            //     if (hasSameRouteMenu.length > 0) {
            //         throw new HttpException("has same route menu", HttpStatus.CONFLICT)
            //     }
            //     const maxMenuId = await this.ds.manager.maximum(Navigation, "menuId")
            //     insertData = {
            //         menuRoute: createDto.route,
            //         menuName: createDto.name,
            //         menuOrder: createDto.order,
            //         menuId: maxMenuId + 1
            //     }
            //     break
            // }
        }
        return await BaseService.insertOne(this.ds, Navigation, insertData)
    }
    @Delete(":navigationType/:selfId")
    async delete(
        @Param("navigationType") navigationType: string,
        @Param("selfId") selfId: string) {
        const checkType = Object.values(NavigationItemType).includes(navigationType as any)
        if (!checkType) {
            throw new HttpException("無此類型", HttpStatus.BAD_REQUEST)
        }
        const targetIdKey = (() => {
            switch (navigationType as NavigationItemType) {
                case NavigationItemType.Subcategory:
                    return "subCategoryId"
                case NavigationItemType.Category:
                    return "categoryId"
                case NavigationItemType.Menu:
                    return "menuId"
            }
        })()
        const numId = Number(selfId)
        const findRow = await this.ds.manager.findBy(Navigation, { [targetIdKey]: numId })
        if (findRow.length !== 1) {
            throw new HttpException("不可刪除有子元素的種類", HttpStatus.BAD_REQUEST)
        }
        if (navigationType === NavigationItemType.Subcategory) {
            const findSeries = await this.ds.manager.findOneBy(Series, { navigation: { subCategoryId: numId } })
            if (findSeries) {
                throw new HttpException("不可刪除有子元素的系列", HttpStatus.BAD_REQUEST)
            }
        }
        if (navigationType !== NavigationItemType.Menu) {
            return await this.ds.manager.delete(Navigation, { [targetIdKey]: numId })
        }
        //below for menu
        const queryRunner = this.ds.createQueryRunner()
        await queryRunner.connect()
        let errorStr
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(Navigation, { [targetIdKey]: numId })

            const imageFilePath = getMenuBannerImageFilePath(selfId)
            await unlink(imageFilePath)
            await queryRunner.commitTransaction()
        } catch (err) {
            errorStr = err
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
        if (errorStr) {
            throw new HttpException(errorStr, HttpStatus.CONFLICT)
        }
    }

    @Post("menu")
    @UseInterceptors(FileInterceptor(KEY_FOR_UPLOAD_IMAGE_FORM_DATA))
    async insertMenu(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: 'image/jpeg',
                })
                .addMaxSizeValidator({
                    maxSize: MENU_BANNER_IMG_MAX_SIZE
                })
                .build({
                    fileIsRequired: true,
                    errorHttpStatusCode: 500
                }),
        )
        imageFile: Express.Multer.File,
        @Body() formDataBody: FormDataBody
    ) {
        const createData = JSON.parse(formDataBody.stringifyJson)
        const createDto = new CreateDto()
        Object.assign(createDto, createData)
        const dtoErrors = await validate(createDto, { whitelist: true })
        if (dtoErrors.length > 0) {
            throw new HttpException("資料驗證錯誤", HttpStatus.UNPROCESSABLE_ENTITY)
        }
        const hasSameRouteMenu = await this.ds.manager
            .findBy(Navigation, {
                menuRoute: createDto.route,
                categoryId: IsNull(),
                subCategoryId: IsNull()
            })
        if (hasSameRouteMenu.length > 0) {
            throw new HttpException("has same route menu", HttpStatus.CONFLICT)
        }
        const maxMenuId = await this.ds.manager.maximum(Navigation, "menuId")
        const insertData = {
            menuRoute: createDto.route,
            menuName: createDto.name,
            menuOrder: createDto.order,
            menuId: maxMenuId + 1
        }
        const queryRunner = this.ds.createQueryRunner()
        await queryRunner.connect()
        let errorStr
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.insert(Navigation, insertData)
            const newMenuId = insertData.menuId
            const imageSavePath = getMenuBannerImageFilePath(String(newMenuId))
            await writeFile(imageSavePath, imageFile.buffer)
            await queryRunner.commitTransaction()
        } catch (err) {
            errorStr = err
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
        if (errorStr) {
            throw new HttpException(errorStr, HttpStatus.CONFLICT)
        }
    }
}