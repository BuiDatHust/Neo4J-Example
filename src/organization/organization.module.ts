import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './service/organization.service';
import { Neo4jConfig, Neo4jDatabaseModule } from 'src/neo4j-database';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrganizationRepository } from './repositories/organization.repositories';

@Module({
  imports: [
    Neo4jDatabaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): Neo4jConfig => ({
        scheme: configService.get('DB_SCHEME'),
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
      }),
      global: true,
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationRepository],
})
export class OrganizationModule {}
