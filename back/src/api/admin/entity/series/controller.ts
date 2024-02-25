
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put } from "@nestjs/common";
import { OmitType, PartialType } from "@nestjs/mapped-types";
import { IsInt, IsString } from "class-validator";
import { DataSource } from "typeorm";
import { BaseService } from "../baseService";
import { getEnitiyApiPrefix } from "../utils";
import { Navigation, Product, Series, SubProduct } from "src/entity/entity";
class CreateDto {
    @IsString()
    name: string
    @IsInt()
    order: number
    @IsInt()
    parentId: number //subCategoryId
}
class UpdateDto extends OmitType(PartialType(CreateDto), ["parentId"]) { }
@Controller(getEnitiyApiPrefix(Series))
export class _Controller {
    constructor(
        private ds: DataSource,
    ) { }
    @Get("test/:subCategoryId")
    async test(@Param("subCategoryId") subCategoryId: string) {
        return await this.ds.manager.find(Series, {
            where: {
                navigation: {
                    subCategoryId: +subCategoryId
                }
            },
            order: {
                order: "ASC"
            },
            select: {
                products: {
                    subProducts: {
                        id: true
                    }
                }
            },
            relations: {
                products: {
                    gender: true,
                    subProducts: true
                }
            }
        },
        )
    }
    @Get("tree/:subCategoryId")
    async getTreeBySubCategoryId(@Param("subCategoryId") subCategoryId: string) {
        const series = await this.ds.manager
            .createQueryBuilder(Series, "s")
            .select("s.id", "id")
            .addSelect("s.name", "name")
            .addSelect("s.order", "order")
            .orderBy("s.order")
            .innerJoin(Navigation, "n", "s.navigationId = n.id AND n.subCategoryId = :subCategoryId ", { subCategoryId: +subCategoryId })
            .getRawMany()
        if (series.length === 0) {
            return []
        }
        for (let i = 0; i < series.length; i++) {
            const childrenProducts = await this.ds.manager
                .createQueryBuilder()
                .select("p.id", "id")
                .addSelect("p.name", "name")
                .addSelect("min_orders.id", "subproductId")
                .from(Product, "p")
                .where("p.seriesId = :seriesId", { seriesId: series[i].id })
                .leftJoin(
                    subQuery => {
                        return subQuery
                            .select("min(sp.order) AS min_order, sp.id, sp.productId")
                            .from(SubProduct, "sp")
                            .groupBy("sp.productId")
                    },
                    "min_orders",
                    "min_orders.productId = p.id"
                )
                .orderBy("p.order")
                .getRawMany();
            series[i].products = childrenProducts
        }
        return series
    }
    @Get(":id")
    async getOne(@Param("id") id: string) {
        return await this.ds.manager
            .createQueryBuilder(Series, "s")
            .select("s.id", "id")
            .addSelect("s.name", "name")
            .addSelect("s.order", "order")
            .addSelect("n.menuName || '-' || n.categoryName || '-' || n.subCategoryName || '-' || s.name", "navigationName")
            .orderBy("s.order")
            .innerJoin(Navigation, "n", "s.navigationId = n.id")
            .where("s.id = :id", { id: +id })
            .getRawMany()
    }
    @Get()
    async getAll() {
        return await this.ds.manager
            .createQueryBuilder(Series, "s")
            .select("s.id", "id")
            .addSelect("s.name", "name")
            .addSelect("s.order", "order")
            .addSelect("n.menuName || '-' || n.categoryName || '-' || n.subCategoryName || '-' || s.name", "navigationName")
            .orderBy("s.order")
            .innerJoin(Navigation, "n", "s.navigationId = n.id")
            .getRawMany()
    }
    @Put(":id")
    async updateById(
        @Param("id") id: string,
        @Body() updateDto: UpdateDto
    ) {
        return await BaseService.updateById(id, this.ds, Series, updateDto)
    }
    @Post()
    async insert(@Body() createDto: CreateDto) {
        const subCategoryId = createDto.parentId
        const parentNav = await this.ds.manager.findOneBy(Navigation, { subCategoryId })
        if (!parentNav) {
            throw new HttpException("無此副種類", HttpStatus.BAD_REQUEST)
        }
        const newItem = new Series()
        newItem.name = createDto.name
        newItem.order = createDto.order
        newItem.navigation = parentNav
        return await this.ds.manager.insert(Series, newItem)
    }
    @Delete(":id")
    async delete(@Param("id") id: string) {
        console.log(id, 111)
        const hasSeries = await this.ds.manager.findOneBy(Series, { id: +id })
        if (!hasSeries) {
            throw new HttpException("無此ID", HttpStatus.BAD_REQUEST)
        }
        const findChildren = await this.ds.manager.findBy(Product, { series: { id: +id } })
        if (findChildren.length > 0) {
            console.log(findChildren,111)
            throw new HttpException("不能刪除有子元素的物件", HttpStatus.BAD_REQUEST)
        }
        return await this.ds.manager.delete(Series, { id: +id })
    }
}