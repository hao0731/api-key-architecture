import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { MongoConfig, mongoConfig, tokenConfig } from './config';
import { UserModule } from './user';
import { ApiKeyModule } from './api-key';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongoConfig, tokenConfig],
    }),
    LoggerModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: (config: MongoConfig) => ({
        uri: config.uri,
      }),
      inject: [mongoConfig.KEY],
    }),
    UserModule,
    ApiKeyModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
  ],
})
export class AppModule {}
