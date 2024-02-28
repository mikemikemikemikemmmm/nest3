import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionFilter } from './filter/exceptionFilter';
import { ResponseInterceptor } from './Interceptor/responseInterceptor';
import { Enviroment, getNowEnviroment, isDevEnviroment } from './config/env';
import helmet from 'helmet';
import { helmetConfig } from './config/helmet';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(helmet(helmetConfig));
  if (isDevEnviroment) {
    app.enableCors();
  } else {
    const frontendOrigin = configService.get<string>("FRONTEND_ORIGIN")
    app.enableCors({
      origin: frontendOrigin
    });
    const productionPrefix = configService.get<string>("PRODUCTION_PREFIX")
    app.setGlobalPrefix(productionPrefix)
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
