import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthorResolver } from './author.resolver';
import { Author, AuthorSchema } from './author.schema';
import { AuthorService } from './author.service';
import { Book, BookSchema } from '../book/book.schema';
import { BookService } from '../book/book.service';
import { User, UserSchema } from '../user/user.schema';
import { UserService } from '../user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Book.name, schema: BookSchema },
      { name: Author.name, schema: AuthorSchema },
      { name: User.name, schema: UserSchema }
    ])
  ],
  providers: [AuthorResolver, AuthorService, BookService, UserService]
})
export class AuthorModule {}
