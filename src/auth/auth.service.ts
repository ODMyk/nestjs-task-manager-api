import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private userRepository: UserRepository,
  ) {}

  async signup(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signup(authCredentialsDto);
  }

  async signin(authCredentialsDto: AuthCredentialsDto) {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!username) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
