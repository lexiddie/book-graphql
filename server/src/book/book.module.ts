import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BookResolver } from './book.resolver';
import { Book, BookSchema } from './book.schema';
import { BookService } from './book.service';
import { Author, AuthorSchema } from '../author/author.schema';
import { AuthorService } from '../author/author.service';
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
  providers: [BookResolver, BookService, AuthorService, UserService]
})
export class BookModule {}
