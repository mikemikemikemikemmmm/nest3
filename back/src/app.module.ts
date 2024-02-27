import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EntityModule } from './entity/module';
import { getDBUrl, getEnvFilePath, getNowEnviroment,geImageFolderPath, Enviroment } from './config/env';
import { RootApiModule } from './api/module';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthMiddleware } from './guard/auth';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(), isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      driver:require("sqlite3"),
      database: getDBUrl(),
      synchronize: getNowEnviroment() === Enviroment.Development,
      autoLoadEntities: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: geImageFolderPath(),
      serveRoot: '/static/',
      serveStaticOptions: {
        etag: true
      }
    }),
    CacheModule.register(),
    EntityModule,
    RootApiModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
      consumer
        .apply(AuthMiddleware)
        .forRoutes({ path: 'admin*', method: RequestMethod.ALL });
  }
}