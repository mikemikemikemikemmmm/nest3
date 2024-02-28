import { Module } from "@nestjs/common";
import { AdminController } from "./controller"
import { EntityApiModule } from "./entity/module";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { NoCacheInterceptor } from "src/Interceptor/noCache";
@Module({
    imports: [EntityApiModule],
    controllers: [AdminController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: NoCacheInterceptor,
        },
    ],
})
export class AdminApiModule { }