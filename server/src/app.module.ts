import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { get, set } from 'lodash';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { UserModule } from './user/user.module';
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';
import { decode } from './utils/jwt.utils';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('dbUri')
      }),
      inject: [ConfigService]
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      context: ({ req, res }) => {
        // Get the cookie from the request
        const token = get(req, 'cookies.token');
        console.log(`Checking Token`, token);

        // Verify the cookie
        const user = token ? decode(get(req, 'cookies.token')) : null;

        // attach the user object to the request object
        if (user) {
          set(req, 'user', user);
        }

        return { req, res };
      }
    }),
    AuthorModule,
    BookModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
