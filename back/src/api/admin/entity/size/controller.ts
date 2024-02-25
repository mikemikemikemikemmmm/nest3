
import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";
import { DataSource } from "typeorm";
import { BaseService } from "../baseService";
import { getEnitiyApiPrefix } from "../utils";
import { Size } from "src/entity/entity";
class CreateDto {
    @IsString()
    name: string
}
class UpdateDto extends PartialType(CreateDto) { }
@Controller(getEnitiyApiPrefix(Size))
export class _Controller {
    constructor(
        private ds: DataSource,
    ) { }
    // @Get(":id")
    // async getById(@Param("id") id:string){
    //    return await BaseService.getById(id,this.ds,Size)
    // }
    @Get()
    async getAll() {
        return await this.ds.manager.find(Size, {
            order: {
                order: "asc"
            }
        })
    }
    // @Patch(":id")
    // async updateById(
    //     @Param("id") id:string, 
    //     @Body() updateDto: UpdateDto
    //     ){
    //         return await BaseService.updateById(id,this.ds,Size,updateDto)
    //  }
    //  @Post()
    //  async insert(@Body() updateDto: CreateDto){
    //     return await BaseService.insertOne(this.ds,Size,updateDto)
    //   }
}