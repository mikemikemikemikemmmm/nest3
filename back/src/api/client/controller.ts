import { Controller, Get, HttpStatus, Param, Query, Req, Res } from "@nestjs/common";

import { Color, Gender, Navigation, Product, Series, Size, Stock, SubProduct } from "src/entity/entity";
import { DataSource } from "typeorm";

@Controller('client')
export class ClientController {
    constructor(private ds: DataSource) { }
    @Get("navigation")
    async getNavigation() {
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
                            subQuery2 => {
                                return subQuery2
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

    @Get("series")
    async getSeries(
        @Query("menuRoute") menuRoute: string,
        @Query("categoryRoute") categoryRoute?: string,
        @Query("subcategoryRoute") subcategoryRoute?: string,
    ) {
        const sql = this.ds.manager.createQueryBuilder()
            .addSelect("s.id", "id")
            .addSelect("s.name", "name")
            .addSelect(`json_group_array(
                json_object(
                    'id', productCard.id,
                    'name', productCard.name,
                    'subproducts', productCard.subproducts
                )
            )`, "productCards")
            .from(Series, "s")
            .groupBy("s.id")
            .orderBy("s.order")
        if (subcategoryRoute && categoryRoute) {
            sql.innerJoin(Navigation, "n",
                `s.navigationId = n.id and 
             n.menuRoute = :menuRoute and 
             n.categoryRoute = :categoryRoute and
             n.subCategoryRoute = :subcategoryRoute
             `,
                { menuRoute, subcategoryRoute, categoryRoute })
        } else {
            sql.innerJoin(Navigation, "n",
                `s.navigationId = n.id and n.menuRoute = :menuRoute
            `,
                { menuRoute })
        }
        sql.innerJoin(subQuery => {
            return subQuery
                .addSelect("p.id", "id")
                .addSelect("p.name", "name")
                .addSelect("p.seriesId", "seriesId")
                .addSelect("g.name", "genderName")
                .addSelect(`json_group_array(
                        json_object(
                            'id', subproduct.id,
                            'colorName', subproduct.colorName,
                            'colorId', subproduct.colorId,
                            'price', subproduct.price
                        )
                    )`, "subproducts")
                .from(Product, "p")
                .groupBy("p.id")
                .orderBy("p.order")
                .innerJoin(Gender, "g", "g.id = p.genderId")
                .innerJoin(
                    subQuery2 => {
                        return subQuery2
                            .addSelect("sp.id", "id")
                            .addSelect("sp.colorId", "colorId")
                            .addSelect("sp.productId", "productId")
                            .addSelect("c.name", "colorName")
                            .addSelect("sp.price", "price")
                            .from(SubProduct, "sp")
                            .orderBy("sp.order")
                            .groupBy("sp.id")
                            .innerJoin(Color, "c", "c.id = sp.colorId")
                    }
                    , "subproduct", "subproduct.productId = p.id")
        }, "productCard", "productCard.seriesId = s.id")
        const result = await sql.getRawMany()
        result.forEach(series => {
            series.productCards = JSON.parse(series.productCards)
            series.productCards.forEach(pc => pc.subproducts = JSON.parse(pc.subproducts))
        })
        return result
    }

    @Get("productDetail/:productId")
    async getProductDetail(
        @Param("productId") productId: string
    ) {
        const result = await this.ds.manager
            .createQueryBuilder()
            .addSelect("p.id", "id")
            .addSelect("p.name", "name")
            .addSelect("p.imageFileNameListStringifyJson","imageFileNameListStringifyJson")
            .addSelect("g.name", "genderName")
            .addSelect(`json_group_array(
                json_object(
                    'id', subproducts.id,
                    'price',subproducts.price,
                    'colorId',subproducts.colorId,
                    'colorName',subproducts.colorName,
                    'sizes',subproducts.sizes
                )
            )`, "subproducts")
            .from(Product, "p")
            .orderBy("p.order")
            .groupBy("p.id")
            .where("p.id = :productId", { productId: +productId })
            .innerJoin(Gender, "g", "g.id= p.genderId")
            .innerJoin(Series, "s", "s.id= p.seriesId")
            .innerJoin(subQuery => {
                return subQuery
                    .addSelect("sp.id", "id")
                    .addSelect("sp.productId", "productId")
                    .addSelect("sp.price", "price")
                    .addSelect("c.id", "colorId")
                    .addSelect("c.name", "colorName")
                    .addSelect(`json_group_array(
                        json_object(
                            'id', sizes.id,
                            'name', sizes.name
                        )
                    )`, "sizes")
                    .from(SubProduct, "sp")
                    .groupBy("sp.id")
                    .orderBy("sp.order")
                    .innerJoin(Color, "c", "c.id = sp.colorId")
                    .innerJoin(subQuery2 => {
                        return subQuery2
                            .addSelect("si.id", "id")
                            .addSelect("si.name", "name")
                            .addSelect("st.subproductId", "subproductId")
                            .from(Stock, "st")
                            .innerJoin(Size, "si", "si.id = st.sizeId")
                            .orderBy("si.order")
                    }, "sizes", "sizes.subproductId = sp.id")
            }, "subproducts", "subproducts.productId= p.id"
            )
            .getRawOne()
        result.subproducts = JSON.parse(result.subproducts)
        result.subproducts.forEach(sp => {
            sp.sizes = JSON.parse(sp.sizes)
        })
        return result
    }

    @Get("menuRoute/:productId")
    async getProductMenuRoute(
        @Param("productId") productId: string) {
        return await this.ds.manager.createQueryBuilder()
            .select("n.menuRoute", "menuRoute")
            .from(Product, "p")
            .innerJoin(Series, "s", "s.id =p.seriesId")
            .innerJoin(Navigation, "n", "n.id = s.navigationId")
            .where("p.id = :productId", { productId: +productId })
            .getRawOne()
    }

}