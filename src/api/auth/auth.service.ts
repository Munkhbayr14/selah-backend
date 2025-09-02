import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';

import { RegisterUserDto } from './dto/register-user.dto';

import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Profile } from '../profile/entities/profile.entity';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>

  ) { }
  hashData(data: string) {
    return bcrypt.hash(data, 10)
  }

  async signup(registerUserDto: RegisterUserDto) {
    const hash = await this.hashData(registerUserDto.password);
    if (registerUserDto.password !== registerUserDto.confirmationPassword) {
      throw new BadRequestException('Баталгаажуулах нууц үг тохирохгүй байна.');
    }
    const userExists = await this.userRepository.findOne({
      where: { email: registerUserDto.email },
    })
    if (userExists) {
      throw new BadRequestException('Хэрэглэгч бүртгэлтэй байна.');
    }
    try {
      const newUser = this.userRepository.create({
        email: registerUserDto.email,
        firstName: registerUserDto.firstname,
        lastName: registerUserDto.lastname,
        role: registerUserDto.role,
        hash,
      });

      const savedUser = await this.userRepository.save(newUser);

      const profile = this.profileRepository.create({
        firstName: registerUserDto.firstname,
        lastName: registerUserDto.lastname,
        email: registerUserDto.email,
        avatarUrl: null,
        user: savedUser,
      });

      await this.profileRepository.save(profile);

      return {
        message: 'Амжилттай бүртгэгдлээ',
        statusCode: 200,
        userId: savedUser.id,
        email: savedUser.email,
        firstname: savedUser.firstName,
        lastname: savedUser.lastName,
        role: savedUser.role,
        profile: savedUser.profile
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException("Хэрэглэгч бүртгэлтэй байна.");
        }
      }
      throw new Error(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email }
    })
    if (!user) {
      throw new UnauthorizedException('Хэрэглэгчийн нэвтрэх нэр эсвэл нууц үг буруу байна!');
    }
    const passwordMatch = await bcrypt.compare(loginUserDto.password, user.hash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Хэрэглэгчийн нэвтрэх нэр эсвэл нууц үг буруу байна!');
    }

    const payload = { email: user.email, userId: user.id, username: user.firstName, role: user.role };
    return {
      statusCode: 200,
      message: "Амжилттай нэвтэрлээ",
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '1d' }),
      userId: user.id,
      email: user.email,
      username: user.firstName,
      role: user.role
    };
  }

  async logout(userId: number) {
    await this.userRepository.update(userId, { refreshToken: null });

    return {
      message: 'Logged out successfully',
      statusCode: 200,
    };
  }
}
