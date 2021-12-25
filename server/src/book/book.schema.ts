import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType, ID, InputType } from '@nestjs/graphql';
import { Author } from '../author/author.schema';
import { User } from '../user/user.schema';

export type BookDocument = Book & Document;

@Schema({ timestamps: true })
@ObjectType()
export class Book {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field()
  title: string;

  @Prop({ required: true })
  @Field()
  isbn: string;

  @Prop({ required: true })
  @Field()
  rate: number;

  @Prop({ required: true })
  @Field()
  publisher: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Author' })
  @Field(() => Author)
  author: Author;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Field(() => User)
  createdBy: User;

  @Prop({ type: Date })
  @Field()
  createdAt: Date;

  @Prop({ type: Date })
  @Field()
  updatedAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(Book);

BookSchema.index({ author: 1 });

@InputType()
export class CreateBookInput {
  @Field()
  title: string;

  @Field()
  isbn: string;

  @Field()
  rate: number;

  @Field()
  publisher: string;

  @Field()
  author: string;

  @Field()
  createdBy: string;
}

@InputType()
export class FindBookInput {
  @Field()
  _id: string;
}

@InputType()
export class UpdateBookInput {
  @Field(() => ID) // <-- GraphQL Type
  _id: string; // <-- TypeScript Type

  @Field()
  title: string;

  @Field()
  isbn: string;

  @Field()
  rate: number;

  @Field()
  publisher: string;

  @Field()
  author: string;

  @Field()
  createdBy: string;
}

@InputType()
export class DeleteBookInput {
  @Field(() => ID) // <-- GraphQL Type
  _id: string; // <-- TypeScript Type
}
