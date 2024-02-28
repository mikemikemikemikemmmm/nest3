import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseFilePipeBuilder, Post, Put, Query, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { PartialType } from "@nestjs/mapped-types";
import { IsString, validate } from "class-validator";
import { DataSource, Not } from "typeorm";
import { BaseService } from "../baseService";
import { getEnitiyApiPrefix } from "../utils";
import { Color, SubProduct } from "src/entity/entity";
import { FileInterceptor } from "@nestjs/platform-express";
import { COLOR_IMG_MAX_SIZE, KEY_FOR_STRINGIGY_FORM_DATA, KEY_FOR_UPLOAD_IMAGE_FORM_DATA } from "src/const";
import { getColorImageFilePath } from "src/config/env";
import { unlink, writeFile } from "fs/promises";
import { FormDataBody } from "src/type";
import { Like } from 'typeorm';
class CreateDto {
    @IsString()
    name: string
}
class UpdateDto extends PartialType(CreateDto) { }
@Controller(getEnitiyApiPrefix(Color))
export class _Controller {
    constructor(
        private ds: DataSource,
    ) { }
    @Get("name/:name")
    async getByName(@Param("name") name: string) {
        return (await this.ds.manager.findBy(Color, { name }))
    }
    @Get(":id")
    async getById(@Param("id") id: string) {
        return await BaseService.getById(id, this.ds, Color)
    }
    @Get()
    async getAll(@Query("name") colorName: string) {
        const sql = this.ds.createQueryBuilder()
            .select("c.*",)
            .from(Color, "c")
        if (colorName) {
            sql.where("c.name = :colorName", { colorName: Like(`%${colorName}%`) })
        }
        return await sql.getRawMany()
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
                    maxSize: COLOR_IMG_MAX_SIZE
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
        await queryRunner.connect()
        const hasSameName = await queryRunner.manager.findOneBy(Color, { name: updateDto.name, id: Not(+id) })
        if (hasSameName) {
            throw new HttpException("已有相同名稱", HttpStatus.NOT_FOUND)
        }
        let errorStr
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(Color, { id: +id }, updateDto)
            const hasFile = imageFile && imageFile.buffer.length !== 0
            if (hasFile) {
                const imageSavePath = getColorImageFilePath(id)
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
            throw new HttpException(errorStr, HttpStatus.NOT_FOUND)
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
                    maxSize: COLOR_IMG_MAX_SIZE
                })
                .build({
                    fileIsRequired: true,
                    errorHttpStatusCode: HttpStatus.NOT_FOUND
                }),
        )
        imageFile: Express.Multer.File,
        @Body() formDataBody: FormDataBody
    ) {
        const data = JSON.parse(formDataBody.stringifyJson)
        const createDto = new CreateDto()
        Object.assign(createDto, data)
        const dtoErrors = await validate(createDto, { whitelist: true })
        if (dtoErrors.length > 0) {
            throw new HttpException("資料驗證錯誤", HttpStatus.NOT_FOUND)
        }
        const queryRunner = this.ds.createQueryRunner()
        await queryRunner.connect()
        const hasSameName = await queryRunner.manager.findOneBy(Color, { name: createDto.name })
        if (hasSameName) {
            throw new HttpException("已有相同名稱", HttpStatus.NOT_FOUND)
        }
        let errorStr
        await queryRunner.startTransaction();
        try {
            const executeCreate = await queryRunner.manager.insert(Color, createDto)
            const newColorId = executeCreate.raw
            const imageSavePath = getColorImageFilePath(newColorId)
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
    @Delete(":id")
    async delete(@Param("id") id: string) {
        const originData = await this.ds.manager.findBy(Color, { id: +id })
        if (originData.length === 0) {
            throw new HttpException("資料不存在", HttpStatus.CONFLICT)
        }
        const queryRunner = this.ds.createQueryRunner()
        await queryRunner.connect()
        const hasChildren = await queryRunner.manager.findBy(SubProduct, { colorId: +id })
        if (hasChildren.length > 0) {
            throw new HttpException("有產品使用此顏色", HttpStatus.CONFLICT)
        }
        let errorStr
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.delete(Color, { id: +id })
            const imageFilePath = getColorImageFilePath(id)
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
}
