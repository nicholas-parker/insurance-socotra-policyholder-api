import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ClassSerializerInterceptor, INestApplication, Logger, ValidationPipe } from '@nestjs/common';

require('dotenv').config({ path: require('find-config')('.env') });

const logger = new Logger('main');

async function bootstrap(): Promise<INestApplication>  {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors();
  const config = new DocumentBuilder()
  .setTitle('Socotra Policyolder API')
  .setDescription('Manages policy holder, legal address, credit score and bloacklist')
  .setVersion('1.0')
  .addTag('policyholder')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  return app;

}

export async function configureApp(app: INestApplication): Promise<void> {

  app.useGlobalPipes(
      new ValidationPipe({
          transform: true,
          whitelist: true
      })
  );


  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));


  if (require.main === module) {
      const port = process.env.PORT || 3000;
      logger.log(`Starting server on port: ${port}`);
      await app.listen(port);
  }
}


bootstrap()
    .then(async app => configureApp(app))
    .then(() => logger.log(`Bootstrap configuration complete.`))
    .catch(e => {
        throw e;
    });