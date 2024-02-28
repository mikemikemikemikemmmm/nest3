
import { Body, Controller, Delete, Get, HttpException, Param, ParseFilePipeBuilder, Patch, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { PartialType } from "@nestjs/mapped-types";
import { IsInt, IsString } from "class-validator";
import { DataSource } from "typeorm";
import { BaseService } from "../baseService";
import { getEnitiyApiPrefix } from "../utils";
import { Color, Gender, Navigation, Product, Series, Size, Stock, SubProduct } from "src/entity/entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { COLOR_IMG_MAX_SIZE, KEY_FOR_UPLOAD_IMAGE_FORM_DATA, PRODUCT_IMG_MAX_SIZE } from "src/const";
import { FormDataBody } from "src/type";
import { getProductImageFilePath, getProductImageFolderPath } from "src/config/env";
import { unlink, writeFile, mkdir, opendir, stat } from "fs/promises";
class CreateDto {
    @IsString()
    name: string
    @IsInt()
    order: number
    @IsInt()
    genderId: number
    @IsInt()
    seriesId: number
}
class UpdateDto extends PartialType(CreateDto) { }
@Controller(getEnitiyApiPrefix(Product))
export class _Controller {
    constructor(
        private ds: DataSource,
    ) { }
    @Get("withStock")
    async getProductWithStock(@Query("productId") productId: string) {
        const sql = this.ds.createQueryBuilder()
            .addSelect("p.id", "id")
            .addSelect("p.name", "name")
            .addSelect("g.name", "genderName")
            .addSelect("n.menuName || '-' || n.categoryName || '-' || n.subCategoryName || '-' || s.name", "navigationName")
            .addSelect(`json_group_array(
                json_object(
                    'id', subproducts.id,
                    'colorId', subproducts.colorId,
                    'colorName', subproducts.colorName,
                    'stocks',subproducts.stocks
                )
            )`, "subproducts")
            .from(Product, "p")
            .orderBy("p.order")
            .innerJoin(Gender, "g", "g.id = p.genderId")
            .innerJoin(Series, "s", "s.id = p.seriesId")
            .innerJoin(Navigation, "n", "s.navigationId = n.id")
            .innerJoin(
                subQuery => {
                    return subQuery
                        .addSelect("sp.id", "id")
                        .addSelect("sp.productId", "productId")
                        .addSelect("c.id", "colorId")
                        .addSelect("c.name", "colorName")
                        .addSelect("st.id", "stockId")
                        .addSelect("st")
                        .addSelect(`json_group_array(
                        json_object(
                            'id', st.id,
                            'sizeId', si.id,
                            'sizeName', si.name,
                            'stock', st.stock
                        )
                    )`, "stocks")
                        .from(SubProduct, "sp")
                        .orderBy("sp.order")
                        .groupBy("sp.id")
                        .innerJoin(Color, "c", "c.id=sp.colorId")
                        .innerJoin(Stock, "st", "st.subproductId=sp.id")
                        .leftJoin(Size, "si", "st.sizeId=si.id")
                },
                "subproducts",
                "subproducts.productId = p.id"
            )
            .groupBy("subproducts.productId")
        if (productId) {
            sql.where("p.id = :productId", { productId: +productId })
        }
        const result = await sql.getRawMany()
        result.forEach(product => {
            product["subproducts"] = JSON.parse(product["subproducts"])
            product["subproducts"].forEach(sp => {
                sp["stocks"] = JSON.parse(sp["stocks"])
            })
        })
        return result
    }
    @Get("forListPage")
    async getProductListData(
        @Query("seriesId") seriesId: string,
        @Query("name") name: string
    ) {
        const sql = this.ds.createQueryBuilder()
            .select("p.id", "id")
            .addSelect("p.name", "name")
            .addSelect("p.seriesId", "seriesId")
            .addSelect("p.order", "order")
            .addSelect("p.imageFileNameListStringifyJson", "imageFileNameListStringifyJson")
            .addSelect("g.id", "genderId")
            .addSelect("g.name", "genderName")
            .addSelect("min_order_subproduct.id", "subproductId")
            .addSelect("n.menuName || '-' || n.categoryName || '-' || n.subCategoryName || '-' || s.name", "navigationName")
            .from(Product, "p")
            .orderBy("p.order")
            .leftJoin(Gender, "g", "g.id = p.genderId")
            .leftJoin(Series, "s", "s.id = p.seriesId")
            .leftJoin(Navigation, "n", "s.navigationId = n.id")
            .leftJoin(
                subQuery => {
                    return subQuery
                        .select("min(sp.order)", "min_order")
                        .addSelect("sp.id", "id")
                        .addSelect("sp.productId", "productId")
                        .from(SubProduct, "sp")
                        .groupBy("sp.productId")
                },
                "min_order_subproduct",
                "min_order_subproduct.productId = p.id"
            )
        if (seriesId) {
            sql.where("p.seriesId = :seriesId", { seriesId: +seriesId })
        }
        if (name) {
            sql.where("p.name = :name", { name }) 
        }
        return await sql.getRawMany()
    }
    @Get("cards")
    async getAllWithImage(@Query("colorId") colorId: string) {
        const sql = this.ds.createQueryBuilder()
            .select("p.id", "id")
            .addSelect("p.name", "name")
            .addSelect("p.seriesId", "seriesId")
            .addSelect("g.id", "genderId")
            .addSelect("g.name", "genderName")
            .addSelect("min_order_subproduct.id", "subproductId")
            .addSelect("min_order_subproduct.colorId", "colorId")
            .from(Product, "p")
            .orderBy("p.order")
            .innerJoin(Gender, "g", "g.id = p.genderId")
            .innerJoin(
                subQuery => {
                    const sql = subQuery
                        .select("min(sp.order)", "min_order")
                        .addSelect("sp.id", "id")
                        .addSelect("sp.colorId", "colorId")
                        .addSelect("sp.productId", "productId")
                        .from(SubProduct, "sp")
                        .groupBy("sp.productId")
                    if (colorId) {
                        sql.innerJoin(Color, "c", "sp.colorId = :colorId", { colorId })
                    }
                    return sql
                },
                "min_order_subproduct",
                "min_order_subproduct.productId = p.id"
            )
            .orderBy("p.order")
        return await sql.getRawMany()
    }
    @Get(":id")
    async getById(@Param("id") id: string) {
        return await this.ds.createQueryBuilder()
            .select("p.*")
            .addSelect("g.name", "genderName")
            .addSelect("n.menuName || '-' || n.categoryName || '-' || n.subCategoryName || '-' || s.name", "navigationName")
            .from(Product, "p")
            .leftJoin(Gender, "g", "g.id=p.genderId")
            .leftJoin(Series, "s", "s.id = p.seriesId")
            .leftJoin(Navigation, "n", "s.navigationId = n.id")
            .where("p.id = :productId", { productId: +id })
            .getRawOne()
    }
    @Get()
    async getAll() {
        return await this.ds.createQueryBuilder()
            .select("p.*")
            .addSelect("g.name", "genderName")
            .addSelect("n.menuName || '-' || n.categoryName || '-' || n.subCategoryName || '-' || s.name", "navigationName")
            .from(Product, "p")
            .orderBy("p.order")
            .leftJoin(Gender, "g", "g.id=p.genderId")
            .leftJoin(Series, "s", "s.id = p.seriesId")
            .leftJoin(Navigation, "n", "s.navigationId = n.id")
            .getRawMany()
    }
    @Put(":id")
    async updateById(
        @Param("id") id: string,
        @Body() dto: UpdateDto
    ) {
        return await this.ds.manager
            .createQueryBuilder()
            .update(Product)
            .set({
                name: dto.name,
                order: dto.order,
                series: {
                    id: dto.seriesId
                },
                gender: {
                    id: dto.genderId
                },
            })
            .where("id = :id", { id: +id })
            .execute()
    }
    @Post()
    async insert(@Body() dto: CreateDto) {
        return await this.ds.manager
            .createQueryBuilder()
            .insert()
            .into(Product)
            .values({
                name: dto.name,
                order: dto.order,
                series: {
                    id: dto.seriesId
                },
                gender: {
                    id: dto.genderId
                },
                imageFileNameListStringifyJson: "[]"
            })
            .execute();
    }
    @Delete(":id")
    async deleteItem(@Param("id") id: string) {
        const hasChildren = await this.ds.manager.findBy(SubProduct, { productId: +id })
        if (hasChildren.length > 0) {
            throw new HttpException("不可刪除有子元素的產品", 404)
        }
        const { imageFileNameListStringifyJson } = await this.ds.manager.findOneBy(Product, { id: +id })
        const imgList = JSON.parse(imageFileNameListStringifyJson)
        if (imgList.length) {
            throw new HttpException("不可刪除有圖片的產品", 404)
        }
        return await this.ds.manager.delete(Product, { id: +id })
    }

    @Post("image/:productId")
    @UseInterceptors(FileInterceptor(KEY_FOR_UPLOAD_IMAGE_FORM_DATA))
    async insertImage(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: 'image/jpeg',
                })
                .addMaxSizeValidator({
                    maxSize: PRODUCT_IMG_MAX_SIZE
                })
                .build({
                    fileIsRequired: true,
                    errorHttpStatusCode: 500
                }),
        )
        imageFile: Express.Multer.File,
        @Param("productId") productId: string

    ) {
        const dirPath = getProductImageFolderPath(productId)
        try {
            const dirStat = await stat(dirPath);
            if (!dirStat.isDirectory()) {
                throw Error
            }
        } catch (error) {
            await mkdir(dirPath);
        }
        let errorStr
        const queryRunner = this.ds.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction();
        try {
            const { imageFileNameListStringifyJson } = await queryRunner.manager.findOneBy(Product, { id: +productId })
            const imageFileNameList: string[] = JSON.parse(imageFileNameListStringifyJson)
            const newImageName = String(Date.now()) 
            if (imageFileNameList.includes(newImageName)) {
                throw new HttpException("已有相同名稱的圖片", 500)
            }
            imageFileNameList.push(newImageName)
            const stringify = JSON.stringify(imageFileNameList)
            const a = await queryRunner.manager.update(Product,
                { id: +productId },
                { imageFileNameListStringifyJson: stringify }
            )
            const imageSavePath = getProductImageFilePath(productId, newImageName)
            await writeFile(imageSavePath, imageFile.buffer)
            await queryRunner.commitTransaction()

        } catch (err) {
            errorStr = err
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
        if (errorStr) {
            throw new HttpException(errorStr, 500)
        }
    }
    @Put("image/:productId/:imageName")
    @UseInterceptors(FileInterceptor(KEY_FOR_UPLOAD_IMAGE_FORM_DATA))
    async updateImage(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: 'image/jpeg',
                })
                .addMaxSizeValidator({
                    maxSize: PRODUCT_IMG_MAX_SIZE
                })
                .build({
                    fileIsRequired: true,
                    errorHttpStatusCode: 500
                }),
        )
        imageFile: Express.Multer.File,
        @Param("productId") productId: string,
        @Param("imageName") imageName: string
    ) {
        let errorStr
        try {
            const { imageFileNameListStringifyJson } = await this.ds.manager.findOneBy(Product, { id: +productId })
            const imageFileNameList: string[] = JSON.parse(imageFileNameListStringifyJson)
            if (!imageFileNameList.includes(imageName)) {
                throw new HttpException("無此名稱的圖片", 500)
            }
            const imageSavePath = getProductImageFilePath(productId, imageName)
            await writeFile(imageSavePath, imageFile.buffer)
        } catch (err) {
            errorStr = err
        }
        if (errorStr) {
            throw new HttpException(errorStr, 500)
        }
    }
    @Delete("image/:productId/:imageName")
    async deleteImage(
        @Param("productId") productId: string,
        @Param("imageName") imageName: string
    ) {
        const queryRunner = this.ds.createQueryRunner()
        await queryRunner.connect()
        const { imageFileNameListStringifyJson } = await queryRunner.manager.findOneBy(Product, { id: +productId })
        const imageList: string[] = JSON.parse(imageFileNameListStringifyJson)
        const deleteIndex = imageList.findIndex(_imageName => _imageName === imageName)
        if (deleteIndex === -1) {
            throw new HttpException("無此圖片", 500)
        }
        let errorStr
        await queryRunner.startTransaction();
        try {
            imageList.splice(deleteIndex, 1)
            const newStringify = JSON.stringify(imageList)
            await queryRunner.manager.update(Product,
                { id: +productId },
                {
                    imageFileNameListStringifyJson: newStringify
                })
            const imagePath = getProductImageFilePath(productId, imageName)
            await unlink(imagePath)
            await queryRunner.commitTransaction()
        } catch (err) {
            errorStr = err
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
        if (errorStr) {
            throw new HttpException(errorStr, 500)
        }
    }
}