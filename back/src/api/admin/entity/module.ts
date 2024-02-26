import { Module } from "@nestjs/common";
import { ColorApiModule } from "./color/module";
import { NavApiModule } from "./navigation/module";
import { SeriesApiModule } from "./series/module";
import { GenderApiModule } from "./gender/module";
import { ProductApiModule } from "./product/module";
import { SubProductApiModule } from "./subProduct/module";
import { SizeApiModule } from "./size/module";
import { StockApiModule } from "./stock/module";
@Module({
    imports:[
        ColorApiModule,
        NavApiModule,
        SeriesApiModule,
        GenderApiModule,
        ProductApiModule,
        SubProductApiModule,
        SizeApiModule,
        StockApiModule
    ]
})
export class EntityApiModule{}