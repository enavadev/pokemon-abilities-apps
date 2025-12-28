import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto, AuthResponseDto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticar usuário',
    description: 'Gera um token JWT para autenticação do usuário',
  })
  @ApiBody({ type: AuthDto })
  @ApiResponse({
    status: 200,
    description: 'Autenticação realizada com sucesso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Credenciais inválidas',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Invalid credentials',
        },
      },
    },
  })
  async login(@Body() authDto: AuthDto): Promise<AuthResponseDto> {
    try {
      return await this.authService.login(authDto);
    } catch (error) {
      throw new BadRequestException({
        message: error.message || 'Authentication failed',
      });
    }
  }
}

