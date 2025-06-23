import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Authors E2E', () => {
  let app: INestApplication;

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
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /authors → should create and return a new author', async () => {
    const createDto = {
      firstName: 'Grand',
      lastName: 'Max',
      bio: 'Author of The Max Utilization',
      birthDate: '1944-02-09',
    };

    const response = await request(app.getHttpServer())
      .post('/authors')
      .send(createDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.firstName).toBe('Grand');
  });

  it('GET /authors → should return list of authors', async () => {
    const response = await request(app.getHttpServer())
      .get('/authors')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty('firstName');
  });
});
