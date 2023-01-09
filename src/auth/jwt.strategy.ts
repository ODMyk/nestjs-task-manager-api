import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'testSecret123',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
