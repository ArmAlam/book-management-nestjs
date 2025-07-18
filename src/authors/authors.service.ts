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

  async findOne(id: number): Promise<Author> {
    const author = await this.authorRepo.findOne({ where: { id } });
    if (!author) throw new NotFoundException('Author not found');
    return author;
  }

  async update(id: number, dto: UpdateAuthorDto): Promise<Author> {
    const result = await this.authorRepo.update(id, dto);

    if (result.affected === 0) {
      throw new NotFoundException('Author not found');
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const author = await this.findOne(id);

    // this will also remove books associated with the author due to onDelete: 'CASCADE'
    await this.authorRepo.remove(author);
  }
}
