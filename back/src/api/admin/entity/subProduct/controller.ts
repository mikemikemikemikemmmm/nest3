
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseFilePipeBuilder, Patch, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { PartialType } from "@nestjs/mapped-types";
import { IsInt, IsNumber, validate } from "class-validator";
import { DataSource } from "typeorm";
import { getEnitiyApiPrefix } from "../utils";
import { Color, Size, Stock, SubProduct } from "src/entity/entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { COLOR_IMG_MAX_SIZE, KEY_FOR_STRINGIGY_FORM_DATA, KEY_FOR_UPLOAD_IMAGE_FORM_DATA, SUB_PRODUCT_IMG_MAX_SIZE } from "src/const";
import { getSubproductImageFilePath } from "src/config/env";
import { FormDataBody } from "src/type";
import { unlink, writeFile } from "fs/promises";
class CreateDto {
    @IsInt()
    order: number
    @IsInt()
    price: number
    @IsInt()
    productId: number
    @IsInt()
    colorId: number
    @IsNumber({}, { each: true })
    sizeIdList: number[];
}
class UpdateDto extends PartialType(CreateDto) { }
@Controller(getEnitiyApiPrefix(SubProduct))
export class _Controller {
    constructor(
        private ds: DataSource,
    ) {
    }
    @Get()
    async getAll(@Query("productId") productId: string) {
        const sql = this.ds.createQueryBuilder()
            .addSelect("sp.id", "id")
            .addSelect("sp.price", "price")
            .addSelect("sp.order", "order")
            .addSelect("sp.updated_at", "updated_at")
            .addSelect("sp.productId", "productId")
            .addSelect("c.name", "colorName")
            .addSelect("c.id", "colorId")
            .addSelect("json_group_array(st.sizeId)", "stringifyJsonSizeIdList")
            .from(SubProduct, "sp")
            .innerJoin(Color, "c", "c.id = sp.colorId")
            .innerJoin(Stock, "st", "st.subproductId = sp.id")
            .orderBy("sp.order")
            .groupBy("sp.id")
        if (productId) {
            sql.where("sp.productId = :productId", { productId: +productId })
        }
        const data = await sql.getRawMany()
        return data.map(d => {
            const newData = { ...d }
            newData.sizeIdList = JSON.parse(newData.stringifyJsonSizeIdList)
            delete newData.stringifyJsonSizeIdList
            return newData
        })
    }


    @Put(":id")
    @UseInterceptors(FileInterceptor(KEY_FOR_UPLOAD_IMAGE_FORM_DATA))
    async update(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: 'image/jpeg',
                })
                .addMaxSizeValidator({
                    maxSize: SUB_PRODUCT_IMG_MAX_SIZE
                })
                .build({
                    fileIsRequired: false,
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
                }),
        )
        imageFile: Express.Multer.File,
        @Body() formDataBody: FormDataBody,
        @Param("id") id: string
    ) {
        const data = JSON.parse(formDataBody[KEY_FOR_STRINGIGY_FORM_DATA])
        const updateDto = new UpdateDto()
        Object.assign(updateDto, data)
        const dtoErrors = await validate(updateDto, { whitelist: true })
        if (dtoErrors.length > 0) {
            throw new HttpException("資料驗證錯誤", HttpStatus.NOT_FOUND)
        }
        const queryRunner = this.ds.createQueryRunner()
        await queryRunner.startTransaction()
        let error
        try {
            await queryRunner.manager.createQueryBuilder()
                .update(SubProduct)
                .set({
                    order: updateDto.order,
                    price: updateDto.price,
                    product: {
                        id: updateDto.productId
                    },
                    color: {
                        id: updateDto.colorId
                    },
                })
                .where("id = :id", { id: +id })
                .execute()
            const newSizeIdList = updateDto.sizeIdList
            const existedRawSizeIdList = await queryRunner.manager.createQueryBuilder()
                .addSelect("st.sizeId", "sizeId")
                .from(Stock, "st")
                .where("st.subproductId = :subproductId", { subproductId: +id })
                .getRawMany()
            const oldSizeIdList = existedRawSizeIdList.map(size => size.sizeId)
            newSizeIdList.forEach(async (sizeId) => {
                if (oldSizeIdList.includes(sizeId)) {
                    return
                }
                await queryRunner.manager.insert(Stock, {
                    subproduct: { id: +id }, size: { id: sizeId }, stock: 0
                })
            })
            oldSizeIdList.forEach(async (sizeId) => {
                if (newSizeIdList.includes(sizeId)) {
                    return
                }
                await queryRunner.manager.delete(Stock, {
                    subproduct: { id: +id }, size: { id: sizeId }
                })
            })
            await queryRunner.commitTransaction()
            if (imageFile && imageFile.buffer.length > 0) {
                const imageSavePath = getSubproductImageFilePath(id)
                await writeFile(imageSavePath, imageFile.buffer)
            }
        } catch (err) {
            error = err
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
        if (error) {
            console.log(error)
            throw new HttpException(error, 404)
        }
    }
    @Post()
    @UseInterceptors(FileInterceptor(KEY_FOR_UPLOAD_IMAGE_FORM_DATA))
    async insert(
        @UploadedFile(
            new ParseFilePipeBuilder()
                .addFileTypeValidator({
                    fileType: 'image/jpeg',
                })
                .addMaxSizeValidator({
                    maxSize: SUB_PRODUCT_IMG_MAX_SIZE
                })
                .build({
                    fileIsRequired: true,
                    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
                }),
        )
        imageFile: Express.Multer.File,
        @Body() formDataBody: FormDataBody
    ) {
        const data = JSON.parse(formDataBody[KEY_FOR_STRINGIGY_FORM_DATA])
        const createDto = new CreateDto()
        Object.assign(createDto, data)
        const dtoErrors = await validate(createDto, { whitelist: true })
        if (dtoErrors.length > 0) {
            throw new HttpException("資料驗證錯誤", 404)
        }
        const queryRunner = this.ds.createQueryRunner()
        await queryRunner.startTransaction()
        let error
        try {
            const executeCreate = await queryRunner.manager.insert(SubProduct, createDto)
            const newSubproductId = executeCreate.raw
            const { sizeIdList } = createDto
            sizeIdList.forEach(async (sizeId: number) => {
                await queryRunner.manager.insert(Stock,
                    {
                        size: { id: sizeId },
                        subproduct: { id: newSubproductId },
                        stock: 0
                    })
            })
            const imageSavePath = getSubproductImageFilePath(newSubproductId)
            await queryRunner.commitTransaction()
            await writeFile(imageSavePath, imageFile.buffer)
        } catch (err) {
            error = err
            await queryRunner.rollbackTransaction()
        } finally {
            await queryRunner.release()
        }
        if (error) {
            console.log(error)
            throw new HttpException(error, 404)
        }
    }
    @Delete(":id")
    async delete(@Param("id") id: string) {
        const originData = await this.ds.manager.findBy(SubProduct, { id: +id })
        if (originData.length === 0) {
            throw new HttpException("資料不存在", HttpStatus.CONFLICT)
        }
        const imageFilePath = getSubproductImageFilePath(id)
        const queryRunner = this.ds.createQueryRunner()
        await queryRunner.startTransaction()
        try {
            await queryRunner.manager.delete(Stock, { subproduct: { id: +id } })
            await queryRunner.manager.delete(SubProduct, { id: +id })
            await queryRunner.commitTransaction()
            await unlink(imageFilePath)
        } catch (err) {
            await queryRunner.rollbackTransaction()
            throw new HttpException("刪除失敗", HttpStatus.BAD_REQUEST)
        } finally {
            await queryRunner.release()
        }
    }
}