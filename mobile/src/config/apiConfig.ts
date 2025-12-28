import configData from '../../config.json';

export interface ApiConfig {
  apiUrl: string;
}

export const apiConfig: ApiConfig = configData;

