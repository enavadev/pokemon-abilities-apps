import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RedisService } from '../../infrastructure/redis/redis.service';
import { PokeApiService } from '../../infrastructure/pokeapi/pokeapi.service';
import {
  PokemonResponseDto,
  PokemonAbilityResponseDto,
} from './dto/pokemon.dto';

@Injectable()
export class PokemonService {
  private readonly REDIS_KEY = 'pokemons:all';
  private readonly REDIS_TTL = 5 * 24 * 60 * 60;

  constructor(
    private readonly redisService: RedisService,
    private readonly pokeApiService: PokeApiService,
  ) {}

  async searchPokemons(
    page: number,
    totalPerPage: number,
    searchTerm?: string,
  ): Promise<PokemonResponseDto> {
    try {
      let pokemons = await this.getPokemonsFromCache();

      if (!pokemons || pokemons.length === 0) {
        pokemons = await this.fetchAndCachePokemons();
      }

      let filteredPokemons = pokemons;

      if (searchTerm && searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase().trim();
        filteredPokemons = pokemons.filter((pokemon) =>
          pokemon.toLowerCase().includes(searchLower),
        );
      }

      filteredPokemons.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

      const totalCount = filteredPokemons.length;
      const startIndex = (page - 1) * totalPerPage;
      const endIndex = startIndex + totalPerPage;
      const paginatedPokemons = filteredPokemons.slice(startIndex, endIndex);

      return {
        data: {
          count: totalCount,
          pokemons: paginatedPokemons.map((name) => ({ Name: name })),
        },
      };
    } catch (error) {
      throw new HttpException(
        { data: null },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getPokemonAbilities(
    pokemonName: string,
  ): Promise<PokemonAbilityResponseDto> {
    try {
      const pokemonData = await this.pokeApiService.getPokemonAbilities(
        pokemonName,
      );

      const abilities = pokemonData.abilities.map((ability) => ({
        ability: ability.ability.name,
        hidden: ability.is_hidden,
      }));

      return {
        data: abilities,
      };
    } catch (error) {
      throw new HttpException(
        { data: null },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async getPokemonsFromCache(): Promise<string[]> {
    try {
      const cached = await this.redisService.get(this.REDIS_KEY);
      if (cached) {
        const pokemons = JSON.parse(cached) as string[];
        pokemons.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
        return pokemons;
      }
      return [];
    } catch (error) {
      console.error('Error reading from cache:', error);
      return [];
    }
  }

  private async fetchAndCachePokemons(): Promise<string[]> {
    try {
      const response = await this.pokeApiService.getAllPokemons();
      const pokemonNames = response.results.map((pokemon) => pokemon.name);
      
      pokemonNames.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));

      await this.redisService.set(
        this.REDIS_KEY,
        JSON.stringify(pokemonNames),
        this.REDIS_TTL,
      );

      return pokemonNames;
    } catch (error) {
      console.error('Error fetching pokemons:', error);
      throw new HttpException(
        'Failed to fetch pokemons',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

