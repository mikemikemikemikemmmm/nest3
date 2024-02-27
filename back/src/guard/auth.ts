
import { HttpCode, HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import * as JWT from 'jsonwebtoken'
import { Enviroment, getNowEnviroment } from 'src/config/env';
import { USER_ROLE, USER_ROLE_ALLOW_METHODS } from 'src/const';
@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private configService: ConfigService) { }
    use(req: Request, res: Response, next: NextFunction) {
        if (getNowEnviroment() === Enviroment.Development) {
            next()
        } else {
            const { authorization } = req.headers
            if (!authorization) {
                throw new HttpException("驗證失敗", 401)
            }
            const token = authorization.split(" ")[1]
            if (!token) {
                throw new HttpException("驗證失敗", 401)
            }
            const secret = this.configService.get("JWT_SECRET")
            JWT.verify(token, secret, (error, decoded) => {
                if (error) {
                    throw new HttpException("驗證失敗", 401)
                } else {
                    const role: USER_ROLE = decoded.role
                    const allowMethods = USER_ROLE_ALLOW_METHODS[role] as string[] | undefined
                    if (!allowMethods) {
                        throw new HttpException("驗證失敗", 401)
                    }
                    //req.method may be GET,POST,PUT,DELETE
                    const isValidMethod = allowMethods.includes(req.method)
                    if (!isValidMethod) {
                        throw new HttpException("權限不足", 403)
                    }
                    next();
                }
            })
        }
    }
}
