import {
  Controller,
  Get,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PokemonService } from './pokemon.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  PokemonResponseDto,
  PokemonAbilityResponseDto,
} from './dto/pokemon.dto';

@ApiTags('Pokemons')
@ApiBearerAuth('JWT-auth')
@Controller('pokemon')
@UseGuards(JwtAuthGuard)
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  @ApiOperation({
    summary: 'Buscar Pokemons',
    description:
      'Lista Pokemons com paginação e busca por nome. Requer autenticação JWT.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Número da página',
    example: 1,
  })
  @ApiQuery({
    name: 'totalperpage',
    required: false,
    type: Number,
    description: 'Total de resultados por página',
    example: 10,
  })
  @ApiQuery({
    name: 'p',
    required: false,
    type: String,
    description: 'Termo de busca (nome do Pokemon)',
    example: 'pikachu',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de Pokemons retornada com sucesso',
    type: PokemonResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro na requisição',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'null',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token JWT inválido ou ausente',
  })
  async searchPokemons(
    @Query('page') page: string = '1',
    @Query('totalperpage') totalPerPage: string = '10',
    @Query('p') searchTerm?: string,
  ): Promise<PokemonResponseDto> {
    try {
      const pageNum = parseInt(page, 10) || 1;
      const totalPerPageNum = parseInt(totalPerPage, 10) || 10;

      return await this.pokemonService.searchPokemons(
        pageNum,
        totalPerPageNum,
        searchTerm,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({ data: null }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('ability')
  @ApiOperation({
    summary: 'Obter habilidades do Pokemon',
    description:
      'Retorna a lista de habilidades de um Pokemon específico. Requer autenticação JWT.',
  })
  @ApiQuery({
    name: 'name',
    required: true,
    type: String,
    description: 'Nome do Pokemon',
    example: 'pikachu',
  })
  @ApiResponse({
    status: 200,
    description: 'Habilidades do Pokemon retornadas com sucesso',
    type: PokemonAbilityResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro na requisição - Nome do Pokemon não fornecido ou inválido',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'null',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Não autorizado - Token JWT inválido ou ausente',
  })
  async getPokemonAbilities(
    @Query('name') name: string,
  ): Promise<PokemonAbilityResponseDto> {
    try {
      if (!name) {
        throw new HttpException({ data: null }, HttpStatus.BAD_REQUEST);
      }

      return await this.pokemonService.getPokemonAbilities(name);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException({ data: null }, HttpStatus.BAD_REQUEST);
    }
  }
}

