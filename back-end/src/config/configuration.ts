import { readFileSync } from 'fs';
import { join } from 'path';
import { load } from 'js-yaml';

export interface PokeApiConfig {
  baseUrl: string;
  timeout: number;
}

export interface RedisConfig {
  host: string;
  port: number;
}

export interface AppConfig {
  pokeapi: PokeApiConfig;
  redis: RedisConfig;
}

export default (): AppConfig => {
  const isProduction = process.env.NODE_ENV === 'production';
  const configPath = isProduction
    ? join(process.cwd(), 'config.yaml')
    : join(__dirname, '../../config.yaml');
  
  try {
    const fileContents = readFileSync(configPath, 'utf8');
    const config = load(fileContents) as AppConfig;
    
    return {
      pokeapi: {
        baseUrl: process.env.POKEAPI_BASE_URL || config.pokeapi?.baseUrl || 'https://pokeapi.co/api/v2',
        timeout: process.env.POKEAPI_TIMEOUT 
          ? parseInt(process.env.POKEAPI_TIMEOUT, 10) 
          : (config.pokeapi?.timeout || 10000),
      },
      redis: {
        host: process.env.REDIS_HOST || config.redis?.host || 'localhost',
        port: process.env.REDIS_PORT 
          ? parseInt(process.env.REDIS_PORT, 10) 
          : (config.redis?.port || 6379),
      },
    };
  } catch (error) {
    console.warn('Failed to load config.yaml, using environment variables or defaults:', error);
    
    return {
      pokeapi: {
        baseUrl: process.env.POKEAPI_BASE_URL || 'https://pokeapi.co/api/v2',
        timeout: parseInt(process.env.POKEAPI_TIMEOUT || '10000', 10),
      },
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    };
  }
};

