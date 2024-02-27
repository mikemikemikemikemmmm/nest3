import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './filter/exceptionFilter';
import { ResponseInterceptor } from './Interceptor/responseInterceptor';
import { Enviroment, getNowEnviroment } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);
  if (getNowEnviroment() === Enviroment.Development) {
    app.enableCors();
  } else {
    app.enableCors({
      origin: "http://localhost"
    });
  }
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
