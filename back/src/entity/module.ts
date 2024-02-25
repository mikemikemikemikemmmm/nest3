
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    User,
    Navigation,
    // Category,
    // SubCategory,
    Series,
    Product,
    SubProduct,
    Color,
    Gender,
    Size,
    Stock
}from "./entity"

@Module({
  imports: [TypeOrmModule.forFeature([
    User,
    Navigation,
    // Category,
    // SubCategory,
    Series,
    Product,
    SubProduct,
    Color,
    Gender,
    Size,
    Stock
])],
})
export class EntityModule {}
