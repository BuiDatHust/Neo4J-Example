import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get environment variable
   * @param key
   * @returns T if key is defined, otherwise throw an error
   */
  public get<T>(key: string): T {
    const result = this.configService.get(key);

    if (result === undefined || result === null) {
      throw new Error(`Environment variable ${key} is not defined`);
    }
    return result;
  }

  public get neo4JOptions() {
    return {
      scheme: this.configService.get<string>('db.scheme'),
      host: this.configService.get<string>('db.host'),
      port: this.configService.get<number>('db.port'),
      username: this.configService.get<string>('db.username'),
      password: this.configService.get<string>('db.password'),
      database: this.configService.get<string>('db.database'),
    };
  }
}
