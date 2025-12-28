import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { AppConfig } from '../../config/configuration';

interface PokeApiPokemon {
  name: string;
  url: string;
}

interface PokeApiResponse {
  count: number;
  results: PokeApiPokemon[];
}

interface PokeApiAbility {
  ability: {
    name: string;
  };
  is_hidden: boolean;
}

interface PokeApiPokemonDetail {
  abilities: PokeApiAbility[];
}

@Injectable()
export class PokeApiService {
  private readonly axiosInstance: AxiosInstance;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService<AppConfig>) {
    const pokeApiConfig = this.configService.get('pokeapi', { infer: true });
    this.baseUrl = pokeApiConfig?.baseUrl || 'https://pokeapi.co/api/v2';
    const timeout = pokeApiConfig?.timeout || 10000;

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout,
    });
  }

  async getAllPokemons(): Promise<PokeApiResponse> {
    try {
      const response = await this.axiosInstance.get<PokeApiResponse>(
        '/pokemon?limit=100000&offset=0',
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch pokemons from PokeAPI',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPokemonAbilities(pokemonName: string): Promise<PokeApiPokemonDetail> {
    try {
      const response = await this.axiosInstance.get<PokeApiPokemonDetail>(
        `/pokemon/${pokemonName.toLowerCase()}`,
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Failed to fetch abilities for pokemon: ${pokemonName}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}

