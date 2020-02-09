import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { microserviceConfig} from "./microserviceConfig";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice(microserviceConfig);

  await app.startAllMicroservicesAsync();
  await app.listen(3000);
}
bootstrap();
