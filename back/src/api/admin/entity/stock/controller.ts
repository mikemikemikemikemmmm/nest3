
import { Body, Controller, Delete, Get, HttpException, Param, ParseArrayPipe, Patch, Post, Put } from "@nestjs/common";
import { PartialType } from "@nestjs/mapped-types";
import { ArrayMinSize, IsArray, IsInt, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { DataSource } from "typeorm";
import { BaseService } from "../baseService";
import { getEnitiyApiPrefix } from "../utils";
import { Size, Stock } from "src/entity/entity";
class StockUpdateDtoItem {
    @IsInt()
    stockId: number
    @IsInt()
    stock: number
}
@Controller(getEnitiyApiPrefix(Stock))
export class _Controller {
    constructor(
        private ds: DataSource,
    ) { }
    @Put("")
    async update(
        @Body(new ParseArrayPipe({ items: StockUpdateDtoItem }))
        updateDtoList: StockUpdateDtoItem[]
    ) {
        const queryRunner = this.ds.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction();
        let errorStr
        try {
            for (let i = 0; i < updateDtoList.length; i++) {
                const dto = updateDtoList[i]
                const findById = await queryRunner.manager.findOneBy(Stock, { id: dto.stockId })
                if (!findById) {
                    throw new HttpException("無此Id", 500)
                }
                await queryRunner.manager.update(Stock, { id: dto.stockId }, { stock: dto.stock })
            }
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