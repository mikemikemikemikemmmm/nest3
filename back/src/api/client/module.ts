import { Module } from "@nestjs/common";
import {ClientController}from "./controller"
@Module({
    controllers:[ClientController]
})
export class ClientApiModule{}