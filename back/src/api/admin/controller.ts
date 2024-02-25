import { Controller, Get, Header, Param, Req } from "@nestjs/common";
import { Color } from "src/entity/entity";
import { DataSource, Entity } from "typeorm";

@Controller('admin')
export class AdminController {
    constructor(
        private ds: DataSource,
    ) { }
    @Get("")
    async get123() {
        return 124124214214
    }
}