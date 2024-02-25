
import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";
import { DataSource } from "typeorm";
import { BaseService } from "../baseService";
import { getEnitiyApiPrefix } from "../utils";
import { Gender } from "src/entity/entity";
class CreateDto{
    @IsString()
    text:string
}
class UpdateDto extends PartialType(CreateDto) {}
@Controller(getEnitiyApiPrefix(Gender))
export class _Controller {
    constructor(
        private ds: DataSource,
    ) {}
    @Get(":id")
    async getById(@Param("id") id:string){
       return await BaseService.getById(id,this.ds,Gender)
    }
    @Get()
    async getAll(){
        return await BaseService.getMany(this.ds,Gender)
    }
    @Patch(":id")
    async updateById(
        @Param("id") id:string, 
        @Body() updateDto: UpdateDto
        ){
            return await BaseService.updateById(id,this.ds,Gender,updateDto)
     }
     @Post()
     async insert(@Body() updateDto: CreateDto){
        return await BaseService.insertOne(this.ds,Gender,updateDto)
      }
}