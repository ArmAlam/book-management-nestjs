import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Book } from './book.entity';
import { Author } from '../authors/author.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private bookRepo: Repository<Book>,

    @InjectRepository(Author)
    private authorRepo: Repository<Author>,
  ) {}

  async create(dto: CreateBookDto): Promise<Book> {
    const author = await this.authorRepo.findOne({
      where: { id: dto.authorId },
    });
    if (!author) {
      throw new BadRequestException('Author does not exist');
    }

    const existing = await this.bookRepo.findOne({ where: { isbn: dto.isbn } });
    if (existing) {
      throw new ConflictException('ISBN already exists');
    }

    const book = this.bookRepo.create({ ...dto, author });
    return this.bookRepo.save(book);
  }
}
