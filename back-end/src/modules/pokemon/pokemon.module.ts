import { Module } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { PokeApiService } from '../../infrastructure/pokeapi/pokeapi.service';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService, PokeApiService],
})
export class PokemonModule {}




