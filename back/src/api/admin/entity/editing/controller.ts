
// import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
// import { PartialType } from "@nestjs/mapped-types";
// import { IsInt, IsString } from "class-validator";
// import { DataSource } from "typeorm";
// import { BaseService } from "../baseService";
// import { getEnitiyApiPrefix } from "../utils";
// import { Editing } from "src/entity/entity";
// class CreateDto{
//     @IsString()
//     targetEntity:string
//     @IsInt()
//     targetId:Number
//     @IsInt()
//     userId:Number
// }
// class UpdateDto extends PartialType(CreateDto) {}
// @Controller(getEnitiyApiPrefix(Editing))
// export class _Controller {
//     constructor(
//         private ds: DataSource,
//     ) {}
//     @Get(":id")
//     async getById(@Param("id") id:string){
//        return await BaseService.getById(id,this.ds,Editing)
//     }
//     @Get()
//     async getAll(){
//         return await BaseService.getMany(this.ds,Editing)
//     }
//     @Patch(":id")
//     async updateById(
//         @Param("id") id:string, 
//         @Body() updateDto: UpdateDto
//         ){
//             return await BaseService.updateById(id,this.ds,Editing,updateDto)
//      }
//      @Post()
//      async insert(@Body() updateDto: CreateDto){
//         return await BaseService.insertOne(this.ds,Editing,updateDto)
//       }
// }