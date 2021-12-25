import { Field, ObjectType, ID, InputType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../user/user.schema';
import { Book } from '../book/book.schema';

export type AuthorDocument = Author & Document;

@Schema({ timestamps: true })
@ObjectType()
export class Author {
  @Field(() => ID) // <-- GraphQL Type
  _id: string; // <-- TypeScript Type

  @Prop()
  @Field()
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  @Field(() => User)
  createdBy: User;

  @Prop({ type: Date })
  @Field()
  createdAt: Date;

  @Prop({ type: Date })
  @Field()
  updatedAt: Date;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Book' }] })
  @Field(() => [Book])
  books: Book[];
}

export const AuthorSchema = SchemaFactory.createForClass(Author);

@InputType()
export class CreateAuthorInput {
  @Field()
  name: string;

  @Field()
  createdBy: string;
}

@InputType()
export class UpdateAuthorInput {
  @Field(() => ID) // <-- GraphQL Type
  _id: string; // <-- TypeScript Type

  @Field()
  name: string;

  @Field()
  createdBy: string;
}

@InputType()
export class DeleteAuthorInput {
  @Field(() => ID) // <-- GraphQL Type
  _id: string; // <-- TypeScript Type
}
