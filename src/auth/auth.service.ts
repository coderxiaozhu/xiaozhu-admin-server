import { HttpException, HttpStatus, Inject, Injectable, Req } from "@nestjs/common";
import { RedisClientType } from "redis";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcryptjs";
import { Repository } from "typeorm";
import * as svgCaptcha from "svg-captcha";
import { LoginDto } from "./dto/login.dto";
import { Request } from "express";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { uuid } from "../utils/uuid";
import { RsaService } from "../services/rsa.service";
import { RefreshTokenDto } from "./dto/refreshToken.dto";

@Injectable()
export class AuthService {
  private checkCaptcha;
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
    private configService: ConfigService,
    private RsaService: RsaService
  ) {}
  async buildCaptch() {
    const captcha = svgCaptcha.createMathExpr({
      mathMin: 1,
      mathMax: 9,
      mathOperator: '+',
      color: true
    })
    this.checkCaptcha = Object.assign(captcha, { id: uuid(), time: new Date() })
    return this.checkCaptcha
  }
  async login(loginDto: LoginDto, @Req() req: Request)  {
    const { accountName } = loginDto
    const user = await this.userRepository.createQueryBuilder("user")
      .where("user.phoneNumber = :accountName", { accountName })
      .orWhere("user.userName = :accountName", { accountName })
      .orWhere("user.email = :accountName", { accountName })
      .select(['user.password', 'user.id'])
      .getOne()
    if (!user) {
      throw new HttpException("该用户不存在", HttpStatus.NOT_FOUND)
    }
    const password = await this.RsaService.decypt(loginDto.publicKey, loginDto.password)
    loginDto.password = password
    await this.redisClient.del(`publicKey:${loginDto.publicKey}`)
    if (!password) {
      throw new HttpException("登录出现异常,请重新登录", HttpStatus.BAD_REQUEST)
    }
    if (!bcrypt.compareSync(loginDto.password, user.password)) {
      throw new HttpException("用户密码错误", HttpStatus.BAD_REQUEST)
    }
    if (loginDto.captcha !== this.checkCaptcha.text) {
      throw new HttpException("验证码错误", HttpStatus.BAD_REQUEST)
    }
    const { expire, refreshExpire } = this.configService.get('token');
    const token = uuid();
    const refreshToken = uuid();
    await this.redisClient
      .multi()
      .set(`token:${token}`, user.id)
      .expire(`token:${token}`, expire)
      .set(`refreshToken:${refreshToken}`, user.id)
      .expire(`refreshToken:${refreshToken}`, refreshExpire)
      .exec()
    return {
      expire,
      token,
      refreshToken,
      refreshExpire
    }
  }
  async refreshToken(dto: RefreshTokenDto) {
    const userId = await this.redisClient.get(`refreshToken:${dto.refreshToken}`)
    if (!userId) {
      throw new HttpException('刷新token失败', HttpStatus.BAD_REQUEST)
    }
    const expire = this.configService.get('token').expire
    const token = uuid()
    await this.redisClient
      .multi()
      .set(`token:${token}`, JSON.stringify({ userId: userId, refreshToken: dto.refreshToken }))
      .expire(`token:${token}`, expire)
      .exec()
    const refreshExpire = await this.redisClient.ttl(`refreshToken:${dto.refreshToken}`)
    return {
      expire,
      token,
      refreshExpire,
      refreshToken: dto.refreshToken
    }
  }
  async loginOut(req: Request) {
    const res = await this.redisClient
      .multi()
      .del(`token:${req['token']}`)
      .del(`refreshToken:${req['userInfo'].refreshToken}`)
      .exec()
    if (res.some(item => item[0])) {
      throw new HttpException('退出登录失败', HttpStatus.EXPECTATION_FAILED)
    }
    return true
  }
}
