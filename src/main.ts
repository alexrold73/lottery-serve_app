import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT;
async function bootstrap() {
  const logger = new Logger(bootstrap.name);
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
  });

  // Configuraciones Globales
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );
  await app.listen(port);
  logger.log(`🚀 Server running on http://localhost:${port}`);
}
bootstrap();

//* TODO Configurar títulos de documentación Swagger
// const options = new DocumentBuilder()
//   .setTitle('Lottery Serve RESTFul API')
//   .setDescription('The lottery endpoints serve')
//   .setVersion('1.0')
//   .build();
// const document = SwaggerModule.createDocument(app, options);
// SwaggerModule.setup('docs', app, document);
