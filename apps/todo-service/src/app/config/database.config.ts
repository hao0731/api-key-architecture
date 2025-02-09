import { ConfigType, registerAs } from '@nestjs/config';

export const mongoConfig = registerAs('mongo', () => ({
  uri: process.env.MONGO_URI,
}));

export type MongoConfig = ConfigType<typeof mongoConfig>;
