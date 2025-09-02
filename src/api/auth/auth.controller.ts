import { Controller, Post, Body, UsePipes, ValidationPipe, Req, UseGuards, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("signup")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        lastname: { type: 'string' },
        firstname: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        confirmationPassword: { type: 'string' },
        role: {
          type: 'string',
          enum: ['USER', 'SUPER_ADMIN',],
          example: 'USER || SUPER_ADMIN',
        },
      },
    },
  })
  signup(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.signup(registerUserDto)
  }

  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
    }
  })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT')
  @Post('logout')
  async logoutUser(@Req() req) {
    console.log(`====> ${req.user.userId}`)
    return await this.authService.logout(req.user.userId);

  }
}
