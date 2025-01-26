import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiKeyDefinition } from './api-key.schema';
import { ApiKeyRepository } from './api-key.repository';
import { ApiKeyController } from './api-key.controller';
import { ApiKeyService } from './api-key.service';

@Module({
  imports: [MongooseModule.forFeature([ApiKeyDefinition])],
  controllers: [ApiKeyController],
  providers: [ApiKeyRepository, ApiKeyService],
})
export class ApiKeyModule {}
