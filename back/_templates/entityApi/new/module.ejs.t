---
to: src/api/entityApi/<%= entityFolderName %>/module.ts
---
<%
 PCName = h.changeCase.pascalCase(entityFolderName)
%>
import { Module } from "@nestjs/common";
import {_Controller} from "./controller"
@Module({
    controllers:[_Controller]
})
export class <%= PCName %>ApiModule{}
