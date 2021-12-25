import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';
import { Book, CreateBookInput, BookDocument, UpdateBookInput } from './book.schema';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async findMany() {
    return this.bookModel.find().lean();
  }

  async findById(id: any) {
    return this.bookModel.findById(id).lean();
  }

  async findByAuthorId(authorId: any) {
    return this.bookModel.find({ author: authorId });
  }

  async createBook(book: CreateBookInput) {
    return this.bookModel.create(book);
  }

  async updateBook(query: FilterQuery<UpdateBookInput>, update: UpdateQuery<any>, options: QueryOptions) {
    return this.bookModel.findByIdAndUpdate(query, update, options);
  }

  async deleteBook(query: FilterQuery<BookDocument>) {
    try {
      const record = await this.bookModel.findByIdAndDelete(query);
      return { _id: record._id, title: record.title };
    } catch (err) {
      console.log(`Delete Book Err: `, err);
      return new Error('The current book does not exist');
    }
  }
}
