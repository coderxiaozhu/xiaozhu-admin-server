import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { RedisClientType } from "redis";
import { Reflector } from "@nestjs/core";

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: RedisClientType,
    private readonly reflector: Reflector
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<Request>()
    const isNotLogin = this.reflector.get('not-login', context.getHandler())
    if (isNotLogin) {
      return next.handle()
    }
    const token = req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', '')
    if (!token) {
      throw new HttpException('未授权', HttpStatus.UNAUTHORIZED)
    }
    const userInfoStr = await this.redisClient.get(`token:${token}`)
    if (!userInfoStr) {
      throw new HttpException('未授权', HttpStatus.UNAUTHORIZED)
    }
    req['userInfo'] = JSON.parse(userInfoStr)
    req['token'] = token
    return next.handle()
  }
}
