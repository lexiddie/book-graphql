import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from '../user/user.schema';
import { UserService } from '../user/user.service';
import { Author } from '../author/author.schema';
import { AuthorService } from '../author/author.service';
import { Book, CreateBookInput, DeleteBookInput, FindBookInput, UpdateBookInput } from './book.schema';
import { BookService } from './book.service';

@Resolver(() => Book)
export class BookResolver {
  constructor(private bookService: BookService, private authorService: AuthorService, private userService: UserService) {}

  @Query(() => [Book]) // <-- What will the query return?
  async books /* <-- Query name */() {
    return this.bookService.findMany(); // Resolve the query
  }

  @Query(() => Book)
  async book(@Args('input') { _id }: FindBookInput) {
    return this.bookService.findById(_id);
  }

  @Mutation(() => Book)
  async createBook(@Args('input') book: CreateBookInput) {
    return this.bookService.createBook(book);
  }

  @Mutation(() => Book)
  async updateBook(@Args('input') input: UpdateBookInput) {
    return this.bookService.updateBook({ _id: input._id }, input, { new: true });
  }

  @Mutation(() => Book)
  async deleteBook(@Args('input') input: DeleteBookInput) {
    return this.bookService.deleteBook({ _id: input._id });
  }

  @ResolveField(() => Author)
  async author(@Parent() book: Book) {
    return this.authorService.findById(book.author);
  }

  @ResolveField(() => User, { nullable: true })
  async createdBy(@Parent() author: Author) {
    return this.userService.findById(author.createdBy);
  }
}
