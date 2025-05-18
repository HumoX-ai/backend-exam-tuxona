/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.username, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { username: user.username, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create({
      ...registerDto,
      role: registerDto.role || 'user',
    });
    // Faqat kerakli maydonlarni ajratib olish
    const { password, ...result } = user.toObject ? user.toObject() : user;
    const payload = {
      username: result.username,
      sub: result._id,
      role: result.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: result,
    };
  }
  async getUserFromToken(payload: any) {
    // payload.sub token ichidagi user ID sini saqlaydi
    const user = await this.usersService.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('Foydalanuvchi topilmadi');
    }
    const { password, ...result } = user.toObject ? user.toObject() : user;
    return result;
  }
}
