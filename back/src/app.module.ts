import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { EntityModule } from './entity/module';
import { getDBUrl, getEnvFilePath, getNowEnviroment, getStaticFileFolderPath, Enviroment } from './config/env';
import { RootApiModule } from './api/module';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthMiddleware } from './guard/auth';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: getEnvFilePath(), isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: getDBUrl(),
      synchronize: getNowEnviroment() === Enviroment.Development,
      autoLoadEntities: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: getStaticFileFolderPath(),
      serveRoot: '/static/'
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