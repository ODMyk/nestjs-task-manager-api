import { Body, Controller, Logger, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Post('/signup')
  signup(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    this.logger.verbose(`User with username "${authCredentialsDto.username}" signs up"`);
    return this.authService.signup(authCredentialsDto);
  }

  @Post('/signin')
  signin(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    this.logger.verbose(`User with username "${authCredentialsDto.username}" signs in"`);
    return this.authService.signin(authCredentialsDto);
  }
}
