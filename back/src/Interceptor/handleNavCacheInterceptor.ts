import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Response } from "express";
import { tap } from "rxjs";
import { DataSource } from "typeorm";


@Injectable()
export class HandleNavDataCacheInterceptor implements NestInterceptor {
  constructor() { }
  async intercept(context: ExecutionContext, next: CallHandler) {
    return next
      .handle()
      .pipe(tap(() => {
        const res: Response = context.switchToHttp().getResponse();
        res.once('finish', () => {
          //TODO
        })
      }))
  }
}
