import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as config from 'config';
import { GetTaskFilterDto } from './tasks/dto/get-task-filter.dto';
import { Task } from './tasks/task.entity';

async function bootstrap() {
  const serverConfig = config.get('server');
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Task manager API')
    .setDescription('What I should type in description ???')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const logger = new Logger('bootstrap');
  const PORT = process.env.PORT || serverConfig.port;
  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  await app.listen(PORT);
  logger.log(`Application started on port ${PORT}`);
}
bootstrap();
