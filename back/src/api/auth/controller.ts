import { Body, Controller, Get, HttpException, Post, Req } from "@nestjs/common";
import { IsEmail, IsString } from "class-validator";
import { User } from "src/entity/entity";
import { ConfigService } from '@nestjs/config';
import { DataSource } from "typeorm";
import * as bcryptjs from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { USER_ROLE } from "src/const";
import { Request } from "express";
class LoginDto {
    @IsEmail()
    email: string
    @IsString()
    password: string
}

class RegisterDto {
    @IsEmail()
    email: string
    @IsString()
    password: string
}
@Controller('auth')
export class AuthController {
    constructor(private ds: DataSource, private configService: ConfigService) { }
    @Post("login")
    async login(@Body() dto: LoginDto) {
        const findUser = await this.ds.manager.findOneBy(User, { email: dto.email })
        if (!findUser) {
            throw new HttpException("無此用戶", 404)
        }
        const isPass = await bcryptjs.compare(dto.password, findUser.password)
        if (!isPass) {
            throw new HttpException("信箱或密碼錯誤'", 404)
        }
        const jwtSecret = this.configService.get("JWT_SECRET")
        const accessToken = jwt.sign(
            { email: findUser.email ,role:findUser.role},
            jwtSecret,
            { expiresIn: '1h' });
        return accessToken
    }
    @Post("register")
    async register(@Body() dto: RegisterDto) {
        const findSameEmail = await this.ds.manager.findOneBy(User, { email: dto.email })
        if (findSameEmail) {
            throw new HttpException("此信箱已經註冊過", 404)
        }
        const saltRounds = this.configService.get("SALT_ROUNDS")
        const salt = await bcryptjs.genSalt(Number(saltRounds));
        const hashedPassword = await bcryptjs.hash(dto.password, salt)
        await this.ds.manager.insert(User, { email: dto.email, password: hashedPassword, role: USER_ROLE.Guest })
    }
    @Get("testToken") 
    async testToken(@Req() req: Request) {
        let isTokenValid = false
        const { authorization } = req.headers
        if (!authorization) {
            return {isTokenValid}
        }
        const token = authorization.split(" ")[1]
        if (!token) {
            return {isTokenValid}
        }
        const secret = this.configService.get("JWT_SECRET")
        jwt.verify(token, secret, (error, decoded) => {
            if (error) {
                return {isTokenValid}
            }
            isTokenValid =true
            return {isTokenValid}
        })
        return {isTokenValid}
    }
}