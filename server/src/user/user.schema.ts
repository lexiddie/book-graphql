import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';

export type UserDocument = User & Document;

@Schema()
@ObjectType()
export class User {
  @Field(() => ID) // <-- GraphQL
  _id: string; // <-- TypeScript

  @Prop({ require: true, unique: true })
  @Field()
  email: string;

  @Prop({ required: true })
  @Field()
  name: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  @Field()
  confirmToken: string;

  @Prop({ required: true, default: true })
  active: boolean;

  comparePassword: (candidatePassword: string) => boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({ email: 1 });

UserSchema.pre('save', async function (next) {
  const user = this as UserDocument;

  // only hash the password if it has been modified or is new
  if (!user.isModified('password')) {
    return next();
  }

  // random additional data
  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hashSync(user.password, salt);

  // replace the password with hash
  user.password = hash;

  return next();
});

UserSchema.post('save', function (error, doc, next) {
  // error.name === 'BulkWriteError'
  if (error.keyValue.email != null && error.code === 11000) {
    next(new Error('The current email is already existed'));
  } else {
    next();
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePassword, user.password).catch((err) => false);
};

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}

@InputType()
export class ConfirmUserInput {
  @Field()
  email: string;

  @Field()
  confirmToken: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
