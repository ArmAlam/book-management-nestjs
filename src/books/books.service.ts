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

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    authorId?: string;
  }): Promise<Book[]> {
    const { page = 1, limit = 10, search, authorId } = query;
    const parsedAuthorId = authorId ? parseInt(authorId, 10) : undefined;

    if (authorId && isNaN(parsedAuthorId as number)) {
      throw new BadRequestException('authorId must be a number');
    }

    const where: any = {};
    if (search) {
      where.title = ILike(`%${search}%`);
    }
    if (parsedAuthorId) {
      where.authorId = parsedAuthorId;
    }

    return this.bookRepo.find({
      where,
      relations: ['author'],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }
}
