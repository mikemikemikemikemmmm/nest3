import { Module } from "@nestjs/common";
import { ClientApiModule } from "./client/module"
import { AdminApiModule } from "./admin/module"
import { AuthApiModule } from "./auth/module";
@Module({
    imports: [AdminApiModule, ClientApiModule, AuthApiModule]
})
export class RootApiModule { }