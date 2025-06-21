import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Author } from './author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorRepo: Repository<Author>,
  ) {}

  async create(dto: CreateAuthorDto): Promise<Author> {
    const author = this.authorRepo.create(dto);
    return this.authorRepo.save(author);
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<Author[]> {
    const { page = 1, limit = 10, search } = query;
    const where = search
      ? [
          { firstName: ILike(`%${search}%`) },
          { lastName: ILike(`%${search}%`) },
        ]
      : undefined;

    return this.authorRepo.find({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Author> {
    const author = await this.authorRepo.findOne({ where: { id } });
    if (!author) throw new NotFoundException('Author not found');
    return author;
  }

  async update(id: string, dto: UpdateAuthorDto): Promise<Author> {
    const author = await this.findOne(id);
    const updated = Object.assign(author, dto);
    return this.authorRepo.save(updated);
  }
}
