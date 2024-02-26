import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import {  AllExceptionFilter } from './filter/exceptionFilter';
import { ResponseInterceptor } from './Interceptor/responseInterceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const adminUrl = configService.get<string>("ADMIN_URL") 
  const clientUrl = configService.get<string>("CLIENT_URL")
  app.enableCors(); 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    })
  );
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  const port = configService.get<number>("PORT")
  await app.listen(port);
  console.log(`listen ${port}`)
}
bootstrap();
