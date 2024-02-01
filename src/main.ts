import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/transform/interceptor/transform.interceptor';
import { HttpExceptionFilter } from './common/http-exception/http-exception.filter';
import { generateDocument } from './doc';
import { logInstance } from './utils/logs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({ instance: logInstance })
  });
  app.useGlobalInterceptors(new TransformInterceptor())
  app.useGlobalFilters(new HttpExceptionFilter())
  generateDocument(app)
  await app.listen(3000);
}
bootstrap();
