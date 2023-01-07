import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '124578',
  database: 'taskmanagement',
  entities: ['dist/tasks/*.entity.{ts,js}'],
  synchronize: true,
  autoLoadEntities: true,
};
