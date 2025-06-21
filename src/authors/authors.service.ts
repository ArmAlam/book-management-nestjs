import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Author } from './author.entity';
import { CreateAuthorDto } from './dto/create-author.dto';

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

  
}
