import { DynamicModule, Module } from '@nestjs/common';
import { EnvironmentService } from './environment.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';

@Module({})
export class EnvironmentModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: EnvironmentModule,
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
        }),
      ],
      providers: [EnvironmentService],
      exports: [EnvironmentService],
    };
  }
}
