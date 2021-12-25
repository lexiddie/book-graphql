import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, UpdateQuery, QueryOptions } from 'mongoose';
import { Author, AuthorDocument, CreateAuthorInput } from './author.schema';

@Injectable()
export class AuthorService {
  constructor(@InjectModel(Author.name) private authorModel: Model<AuthorDocument>) {}

  async findById(id: any) {
    return this.authorModel.findById(id).lean();
  }

  async findMany() {
    return this.authorModel.find().lean();
  }

  async createAuthor(input: CreateAuthorInput) {
    return this.authorModel.create(input);
  }

  async updateAuthor(query: FilterQuery<AuthorDocument>, update: UpdateQuery<any>, options: QueryOptions) {
    return this.authorModel.findByIdAndUpdate(query, update, options);
  }

  async deleteAuthor(query: FilterQuery<AuthorDocument>) {
    // return this.authorModel.deleteOne(query);
    try {
      const record = await this.authorModel.findByIdAndDelete(query);
      return { _id: record._id, name: record.name };
    } catch (err) {
      console.log(`Delete Author Err: `, err);
      return new Error('The current author does not exist');
    }
  }
}
