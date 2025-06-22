import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsService } from './authors.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockAuthor = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  bio: 'A popular author',
  birthDate: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthorsService', () => {
  let service: AuthorsService;
  let repo: Repository<Author>;

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockResolvedValue(mockAuthor),
    find: jest.fn().mockResolvedValue([mockAuthor]),
    findOne: jest.fn(),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthorsService,
        {
          provide: getRepositoryToken(Author),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    repo = module.get<Repository<Author>>(getRepositoryToken(Author));
  });

  afterEach(() => jest.clearAllMocks());

  it('should create an author', async () => {
    const dto = {
      firstName: 'John',
      lastName: 'Doe',
      bio: 'Author bio',
      birthDate: '1980-01-01',
    };

    const result = await service.create(dto as any);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalledWith(dto);
    expect(result).toEqual(mockAuthor);
  });

  it('should return all authors', async () => {
    const result = await service.findAll({});
    expect(repo.find).toHaveBeenCalled();
    expect(result).toEqual([mockAuthor]);
  });

  it('should return a single author', async () => {
    mockRepository.findOne.mockResolvedValue(mockAuthor);
    const result = await service.findOne(1);
    expect(result).toEqual(mockAuthor);
  });

  it('should throw if author not found', async () => {
    mockRepository.findOne.mockResolvedValue(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('should update an author', async () => {
    mockRepository.findOne.mockResolvedValue(mockAuthor);
    const updated = { bio: 'Updated bio' };
    const result = await service.update(1, updated);
    expect(result).toEqual(mockAuthor);
  });

  it('should remove an author', async () => {
    mockRepository.findOne.mockResolvedValue(mockAuthor);
    await service.remove(1);
    expect(repo.remove).toHaveBeenCalledWith(mockAuthor);
  });
});
