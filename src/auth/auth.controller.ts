import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import { Request } from 'express'
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RsaService } from '../services/rsa.service'
import { RefreshTokenDto } from "./dto/refreshToken.dto";
import { NotLogin } from "../common/decorator/not-login.decorator";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly RsaService: RsaService
  ) {}

  @Get('captcha')
  @NotLogin()
  async getCaptcha() {
    return await this.authService.buildCaptch()
  }

  @Post('login')
  @NotLogin()
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    return await this.authService.login(loginDto, req)
  }

  @Get('publicKey')
  @NotLogin()
  async getPublicKey() {
    return this.RsaService.getPublicKey()
  }

  @Post('refresh/token')
  @NotLogin()
  async refreshToken(@Body() dto: RefreshTokenDto) {
    return this.authService.refreshToken(dto)
  }

  @Post('loginOut')
  async loginOut(@Req() req: Request) {
    console.log(req);
    return this.authService.loginOut(req)
  }
}
