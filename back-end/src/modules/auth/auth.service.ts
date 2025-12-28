import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto, AuthResponseDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly FAKE_USER = {
    username: 'teste',
    password: 'teste',
  };

  constructor(private jwtService: JwtService) {}

  async login(authDto: AuthDto): Promise<AuthResponseDto> {
    if (
      authDto.username !== this.FAKE_USER.username ||
      authDto.password !== this.FAKE_USER.password
    ) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: authDto.username, sub: authDto.username };
    const token = this.jwtService.sign(payload);

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24);

    return {
      tokenaccess: token,
      expiration: expirationDate.toISOString(),
    };
  }

  async validateUser(username: string): Promise<any> {
    if (username === this.FAKE_USER.username) {
      return { username };
    }
    return null;
  }
}




