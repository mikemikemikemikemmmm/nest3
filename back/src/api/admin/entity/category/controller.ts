
// import { Body, Controller, Get, Param, Patch, Post, UseInterceptors } from "@nestjs/common";
// import { PartialType } from "@nestjs/mapped-types";
// import { IsInt, IsString } from "class-validator";
// import { DataSource } from "typeorm";
// import { BaseService } from "../baseService";
// import { getEnitiyApiPrefix } from "../utils";
// // import { Category } from "src/entity/entity";
// import { HandleNavDataCacheInterceptor } from "src/Interceptor/handleNavCacheInterceptor";
// class CreateDto{
//     @IsString()
//     text:string
//     @IsInt()
//     order:number
//     @IsString()
//     route:string
//     @IsInt()
//     navId:number
// }
// class UpdateDto extends PartialType(CreateDto) {}
// // @Controller(getEnitiyApiPrefix(Category))
// export class _Controller {
//     constructor(
//         private ds: DataSource,
//     ) {}
//     @Get(":id")
//     async getById(@Param("id") id:string){
//        return await BaseService.getById(id,this.ds,Category)
//     }
//     @Get()
//     async getAll(){
//         return await BaseService.getMany(this.ds,Category)
//     }
//     @UseInterceptors(HandleNavDataCacheInterceptor)
//     @Patch(":id")
//     async updateById(
//         @Param("id") id:string, 
//         @Body() updateDto: UpdateDto
//         ){
//             return await BaseService.updateById(id,this.ds,Category,updateDto)
//      }
//      @UseInterceptors(HandleNavDataCacheInterceptor)
//      @Post()
//      async insert(@Body() updateDto: CreateDto){
//         return await BaseService.insertOne(this.ds,Category,updateDto)
//       }
// }