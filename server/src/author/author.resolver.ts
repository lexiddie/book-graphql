import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from '../user/user.schema';
import { Book } from '../book/book.schema';
import { BookService } from '../book/book.service';
import { Author, CreateAuthorInput, DeleteAuthorInput, UpdateAuthorInput } from './author.schema';
import { AuthorService } from './author.service';
import { UserService } from '../user/user.service';

@Resolver(() => Author)
export class AuthorResolver {
  constructor(private authorService: AuthorService, private bookService: BookService, private userService: UserService) {}

  @Query(() => [Author])
  async authors() {
    return this.authorService.findMany();
  }

  @Mutation(() => Author)
  async createAuthor(@Args('input') input: CreateAuthorInput) {
    return this.authorService.createAuthor(input);
  }

  @Mutation(() => Author)
  async updateAuthor(@Args('input') input: UpdateAuthorInput) {
    return this.authorService.updateAuthor({ _id: input._id }, input, { new: true });
  }

  @Mutation(() => Author)
  async deleteAuthor(@Args('input') input: DeleteAuthorInput) {
    return this.authorService.deleteAuthor({ _id: input._id });
  }

  @ResolveField(() => [Book])
  async books(@Parent() author: Author) {
    return this.bookService.findByAuthorId(author._id);
  }

  @ResolveField(() => User, { nullable: true })
  async createdBy(@Parent() author: Author) {
    return this.userService.findById(author.createdBy);
  }
}
