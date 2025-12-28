import { ApiProperty } from '@nestjs/swagger';

export class PokemonItemDto {
  @ApiProperty({
    description: 'Nome do Pokemon',
    example: 'pikachu',
  })
  Name: string;
}

export class PokemonDataDto {
  @ApiProperty({
    description: 'Total de Pokemons encontrados',
    example: 100,
  })
  count: number;

  @ApiProperty({
    description: 'Lista de Pokemons',
    type: [PokemonItemDto],
  })
  pokemons: PokemonItemDto[];
}

export class PokemonResponseDto {
  @ApiProperty({
    description: 'Dados da resposta',
    type: PokemonDataDto,
  })
  data: PokemonDataDto;
}

export class PokemonAbilityItemDto {
  @ApiProperty({
    description: 'Nome da habilidade',
    example: 'static',
  })
  ability: string;

  @ApiProperty({
    description: 'Indica se a habilidade é oculta',
    example: false,
  })
  hidden: boolean;
}

export class PokemonAbilityResponseDto {
  @ApiProperty({
    description: 'Lista de habilidades do Pokemon',
    type: [PokemonAbilityItemDto],
  })
  data: PokemonAbilityItemDto[];
}

