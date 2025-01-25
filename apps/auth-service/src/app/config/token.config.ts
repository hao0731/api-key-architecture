import { ConfigType, registerAs } from '@nestjs/config';

export const tokenConfig = registerAs('token', () => ({
  audience: process.env.TOKEN_AUDIENCE,
  issuer: process.env.TOKEN_ISSUER,
}));

export type TokenConfig = ConfigType<typeof tokenConfig>;
