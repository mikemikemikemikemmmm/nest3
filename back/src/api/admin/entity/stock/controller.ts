
import { Body, Controller, Delete, Get, HttpException, Param, Patch, Post, Put } from "@nestjs/common";
import { PartialType } from "@nestjs/mapped-types";
import { IsInt, IsString } from "class-validator";
import { DataSource } from "typeorm";
import { BaseService } from "../baseService";
import { getEnitiyApiPrefix } from "../utils";
import { Size, Stock } from "src/entity/entity";
class CreateDto {
    @IsInt()
    subproductId: number
    @IsInt()
    sizeId: number
}
class UpdateDto {
    @IsInt()
    stock: number
}
@Controller(getEnitiyApiPrefix(Size))
export class _Controller {
    constructor(
        private ds: DataSource,
    ) { }
    @Get()
    async getAll() {
        return await BaseService.getMany(this.ds, Size)
    }
    @Put(":id")
    async updateById(
        @Param("id") id: string,
        @Body() dto: UpdateDto
    ) {
        return await BaseService.updateById(id, this.ds, Stock, dto)
    }
    @Post()
    async insert(@Body() dto: CreateDto) {
        const hasItem = await this.ds.manager.findOneBy(Stock, { sizeId: dto.sizeId, subproductId: dto.subproductId })
        if (hasItem) {
            throw new HttpException("已有相同副產品與尺寸", 404)
        }
        return await BaseService.insertOne(this.ds, Stock, { ...dto, stock: 0 })
    }
    @Delete(":id")
    async deleteOne(@Param("id") id: string) {
        const hasItem = await this.ds.manager.findOneBy(Stock, { id: +id })
        if (!hasItem) {
            throw new HttpException("沒有此Id", 404)
        }
        return await BaseService.deleteById(id, this.ds, Stock)
    }
}