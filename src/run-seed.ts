import { AppDataSource } from './data-source';
import { seed } from './seeder';

AppDataSource.initialize()
  .then(async () => {
    console.log('Running migrations...');
    await AppDataSource.runMigrations();

    console.log('Seeding data...');
    await seed();

    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error during migration + seeding', err);
    process.exit(1);
  });
