import { Body, Controller, Logger, Post, ValidationPipe } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SuccessfulLogin } from './successful-login.model';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly logger: Logger;

  constructor(private authService: AuthService) {
    this.logger = new Logger(AuthController.name);
  }

  @ApiCreatedResponse({ description: 'Creates new user and returns nothing' })
  @ApiConflictResponse({
    description: 'Happens, when username is already taken',
  })
  @Post('/signup')
  signup(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<void> {
    this.logger.verbose(
      `User with username "${authCredentialsDto.username}" signs up"`,
    );
    return this.authService.signup(authCredentialsDto);
  }

  @ApiOkResponse({ description: 'Returns access token', type: SuccessfulLogin })
  @ApiUnauthorizedResponse({
    description: 'Happens when auth credentials are incorrect',
  })
  @Post('/signin')
  signin(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<SuccessfulLogin> {
    this.logger.verbose(
      `User with username "${authCredentialsDto.username}" signs in"`,
    );
    return this.authService.signin(authCredentialsDto);
  }
}
