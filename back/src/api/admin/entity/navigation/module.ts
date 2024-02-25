
import { Module } from "@nestjs/common";
import {_Controller} from "./controller"
@Module({
    controllers:[_Controller]
})
export class NavApiModule{}
