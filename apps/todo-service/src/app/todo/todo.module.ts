import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TodoService } from './todo.service';
import { TodoRepository } from './todo.repository';
import { TodoDefinition } from './todo.schema';
import { TodoController } from './todo.controller';

@Module({
  imports: [MongooseModule.forFeature([TodoDefinition])],
  controllers: [TodoController],
  providers: [TodoRepository, TodoService],
})
export class TodoModule {}
