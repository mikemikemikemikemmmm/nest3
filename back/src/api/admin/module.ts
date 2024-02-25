import { Module } from "@nestjs/common";
import {AdminController}from "./controller"
import { EntityApiModule } from "./entity/module";
@Module({
    imports:[EntityApiModule],
    controllers:[AdminController]
})
export class AdminApiModule{}