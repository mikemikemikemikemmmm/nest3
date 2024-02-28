import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EntityModule } from './entity/module';
import { getDBUrl, getEnvFilePath, getNowEnviroment, geImageFolderPath, Enviroment, isDevEnviroment } from './config/env';
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
      driver: require("sqlite3"),
      database: getDBUrl(),
      synchronize: isDevEnviroment,
      autoLoadEntities: true,
    }),
    ServeStaticModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const getServeRoot = () => {
          if (!isDevEnviroment) {
            const prefix = config.get<string>("PRODUCTION_PREFIX")
            return `/${prefix}/static/`
          }
          return "/static/"
        }
        return [{
          rootPath: geImageFolderPath(),
          serveStaticOptions: {
            etag: true
          },
          serveRoot:getServeRoot()
        }]
      },
      inject: [ConfigService]
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