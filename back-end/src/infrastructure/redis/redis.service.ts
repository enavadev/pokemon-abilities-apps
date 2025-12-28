import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { AppConfig } from '../../config/configuration';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  constructor(private configService: ConfigService<AppConfig>) {}

  async onModuleInit() {
    const redisConfig = this.configService.get('redis', { infer: true });
    const redisHost = redisConfig?.host || 'localhost';
    const redisPort = redisConfig?.port || 6379;

    console.log(`Connecting to Redis at ${redisHost}:${redisPort}`);

    this.client = createClient({
      socket: {
        host: redisHost,
        port: redisPort,
      },
    });

    this.client.on('error', (err) => {
      console.error('Redis Client Error', err);
    });

    try {
      await this.client.connect();
      console.log(`Connected to Redis at ${redisHost}:${redisPort}`);
    } catch (error) {
      console.error(`Failed to connect to Redis at ${redisHost}:${redisPort}`, error);
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.disconnect();
    }
  }

  async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setEx(key, ttlSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  getClient(): RedisClientType {
    return this.client;
  }
}

