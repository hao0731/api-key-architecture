import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MongoConfig, mongoConfig, tokenConfig } from './config';
import { UserModule } from './user';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [mongoConfig, tokenConfig],
    }),
    MongooseModule.forRootAsync({
      useFactory: (config: MongoConfig) => ({
        uri: config.uri,
      }),
      inject: [mongoConfig.KEY],
    }),
    UserModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ transform: true }),
    },
  ],
})
export class AppModule {}
