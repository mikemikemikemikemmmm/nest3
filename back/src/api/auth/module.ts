import { Module } from "@nestjs/common";
import {AuthController}from "./controller"
@Module({
    controllers:[AuthController]
})
export class AuthApiModule{}