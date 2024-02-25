
import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { PartialType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";
import { DataSource } from "typeorm";
import { BaseService } from "../baseService";
import { getEnitiyApiPrefix } from "../utils";
import { User } from "src/entity/entity";
class CreateDto{
    @IsString()
    email:string
    @IsString()
    password:string
}
class UpdateDto extends PartialType(CreateDto) {}
@Controller(getEnitiyApiPrefix(User))
export class _Controller {
    constructor(
        private ds: DataSource,
    ) {}
    @Get(":id")
    async getById(@Param("id") id:string){
       return await BaseService.getById(id,this.ds,User)
    }
    @Get()
    async getAll(){
        return await BaseService.getMany(this.ds,User)
    }
    @Patch(":id")
    async updateById(
        @Param("id") id:string, 
        @Body() updateDto: UpdateDto
        ){
            return await BaseService.updateById(id,this.ds,User,updateDto)
     }
     @Post()
     async insert(@Body() updateDto: CreateDto){
        return await BaseService.insertOne(this.ds,User,updateDto)
      }
}