import { InjectModel, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { maxLength } from 'class-validator';
import { ApiKeyHint, API_KEY_HINT_LENGTH } from '@todoapp/api-key/domain';
import {
  checkRoleNameFormat,
  MAX_ROLE_NAME_LENGTH,
  RoleName,
} from '@todoapp/permission/domain';

export type ApiKeyDocument = HydratedDocument<ApiKey> & {
  updatedAt: Date;
  createdAt: Date;
};
export type ApiKeyModel = Model<ApiKeyDocument>;

@Schema({
  collection: 'api-keys',
  timestamps: true,
  versionKey: false,
})
export class ApiKey {
  @Prop({
    type: String,
    required: true,
  })
  key: string;

  @Prop({
    type: String,
    length: API_KEY_HINT_LENGTH,
    required: true,
  })
  keyHint: ApiKeyHint;

  @Prop({
    type: [String],
    required: true,
    validate: {
      validator: (roleNames: Array<string>) => {
        return roleNames.every(
          (roleName) =>
            maxLength(roleName, MAX_ROLE_NAME_LENGTH) &&
            checkRoleNameFormat(roleName)
        );
      },
      message: 'Invalid role name',
    },
  })
  roles: Array<RoleName>;

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  ownerId: Types.ObjectId;

  @Prop({
    type: Date,
  })
  expireDate?: Date;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);

export const ApiKeyDefinition = {
  name: ApiKey.name,
  schema: ApiKeySchema,
};

export const InjectApiKeyModel = () => InjectModel(ApiKeyDefinition.name);
