import { NestFactory } from '@nestjs/core';
import { Logger as Log } from '@nestjs/common';
import { AppModule } from './app.module';
import { EnvironmentService } from './environment';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const envService = app.get(EnvironmentService);

  await app.listen(envService.get<number>('api_port'), () =>
    Log.log(
      'API is running on port ' + envService.get<number>('api_port'),
      'Bootstrap',
    ),
  );
}
bootstrap();
