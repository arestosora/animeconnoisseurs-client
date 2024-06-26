import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { RegisterDto, LoginDto, UpdateProfileDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register({ name, email, password, avatar }: RegisterDto) {
    const user = await this.usersService.findOneByEmail(email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    await this.usersService.create({
      name,
      email,
      avatar,
      password: await bcryptjs.hash(password, 10),
    });

    return {
      name,
      email,
    };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new UnauthorizedException('email is wrong');
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('password is wrong');
    }

    const payload = { email: user.email, role: user.role, id: user.id, banner: user.banner };
    const token = await this.jwtService.signAsync(payload);

    return {
      id: user.id,
      token,
      email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      banner: user.banner
    };
  }

  async profile({ email }: { email: string; role: string }) {
    return await this.usersService.findOneByEmail(email);
  }

  async updateProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.usersService.findOneById(userId);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    await this.usersService.update(userId, updateProfileDto);

    return this.usersService.findOneById(userId);
  }
}
