import { DataSource } from 'typeorm';
import { Author } from './authors/author.entity';
import { Book } from './books/book.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [Author, Book],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
