import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const baseUrl = configService.get('BASE_URL');
  const port = configService.get('PORT');

  const config = new DocumentBuilder()
    .setTitle('Discount Service')
    .setDescription('Discount Service API description')
    .setVersion('1.0')
    .addTag('discount')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  document.servers = [{ url: baseUrl }];
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
