import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorsModule } from './authors/authors.module';
import { Author } from './authors/author.entity';
import { BooksModule } from './books/books.module';
import { Book } from './books/book.entity';

@Module({
  imports: [
     ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database:process.env.DATABASE_URL || 'db.sqlite',
      entities: [Author, Book],
      synchronize: true,
    }),
    AuthorsModule,
    BooksModule,
  ],
})
export class AppModule {}
