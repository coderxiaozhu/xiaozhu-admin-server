import { HttpException, HttpStatus } from '@nestjs/common';

export class R {
  static error(message: string) {
    // 状态码400 错误请求
    return new HttpException(message, HttpStatus.BAD_REQUEST);
  }
  static validateError(message: string) {
    // 状态码422 无法处理的内容
    return new HttpException(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
  static unauthorizedError(message: string) {
    // 状态码401 未经授权
    return new HttpException(message, HttpStatus.UNAUTHORIZED)
  }
  static forbiddenError(message: string) {
    // 状态码403 拒绝访问
    return new HttpException(message, HttpStatus.FORBIDDEN)
  }
}
