import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Books E2E', () => {
  let app: INestApplication;
  let authorId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    // sample author to use in book creation
    const authorRes = await request(app.getHttpServer())
      .post('/authors')
      .send({
        firstName: 'George',
        lastName: 'Orwell',
        bio: 'Author of 1984',
        birthDate: '1903-06-25',
      });

    authorId = authorRes.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /books → should create and return a new book', async () => {
    const dto = {
      title: '1984',
      isbn: '978-3-16-148410-0',
      publishedDate: '1949-06-08',
      genre: 'Dystopian',
      authorId,
    };

    const response = await request(app.getHttpServer())
      .post('/books')
      .send(dto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('1984');
    expect(response.body.author.id).toBe(authorId);
  });

  it('GET /books → should return list of books including author', async () => {
    const response = await request(app.getHttpServer())
      .get('/books')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('title');
    expect(response.body[0]).toHaveProperty('author');
    expect(response.body[0].author).toHaveProperty('firstName');
  });
});
