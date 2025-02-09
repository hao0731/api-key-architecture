import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoConfig, mongoConfig } from './config';
import { TodoModule } from './todo';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongoConfig],
    }),
    LoggerModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: (config: MongoConfig) => ({
        uri: config.uri,
      }),
      inject: [mongoConfig.KEY],
    }),
    TodoModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
  ],
})
export class AppModule {}
