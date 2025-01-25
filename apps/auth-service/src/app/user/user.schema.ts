import {
  InjectModel,
  ModelDefinition,
  Prop,
  Schema,
  SchemaFactory,
} from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import {
  Email,
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
  Username,
} from '@todoapp/user/domain';
import { isEmail } from 'class-validator';

export type UserDocument = HydratedDocument<User>;
export type UserModel = Model<UserDocument>;

@Schema({
  collection: 'users',
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({
    required: true,
    type: String,
    maxlength: MAX_USERNAME_LENGTH,
    minlength: MIN_USERNAME_LENGTH,
  })
  username: Username;

  @Prop({
    required: true,
    type: String,
    validate: {
      validator: (value: string) => isEmail(value),
      message: 'Invalid email address',
    },
  })
  email: Email;

  @Prop({
    type: String,
    required: true,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

export const UserDefinition: ModelDefinition = {
  name: User.name,
  schema: UserSchema,
};

export const InjectUserModel = () => InjectModel(UserDefinition.name);
