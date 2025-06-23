import { AppDataSource } from './data-source';
import { Author } from './authors/author.entity';
import { Book } from './books/book.entity';

export const seed = async () => {
  const authorRepo = AppDataSource.getRepository(Author);
  const bookRepo = AppDataSource.getRepository(Book);

  const existing = await authorRepo.findOneBy({ firstName: 'Jane', lastName: 'Austen' });
  if (existing) return console.log('Seed already ran. Skipping.');

  const author = authorRepo.create({
    firstName: 'Jane',
    lastName: 'Austen',
    bio: 'Author of Pride and Prejudice',
    birthDate: new Date('1775-12-16'),
  });
  await authorRepo.save(author);

  const book = bookRepo.create({
    title: 'Pride and Prejudice',
    isbn: '978-1-56619-909-4',
    publishedDate: new Date('1813-01-28'),
    genre: 'Romance',
    author,
  });
  await bookRepo.save(book);

  console.log('Seed complete!');
};
