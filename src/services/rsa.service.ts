import * as NodeRSA from 'node-rsa'
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { RedisClientType } from "redis";
@Injectable()
export class RsaService {
  constructor(
    @Inject('REDIS_CLIENT') readonly redisClient: RedisClientType,
  ) {}

  async getPublicKey() {
    const key = new NodeRSA({ b: 512 })
    const publicKey = key.exportKey('public')
    const privateKey = key.exportKey('private')
    await this.redisClient.set(`publicKey:${publicKey}`, privateKey)
    return publicKey
  }

  async decypt(publicKey: string, data: string) {
    const privateKey = await this.redisClient.get(`publicKey:${publicKey}`)
    if (!privateKey) {
      throw new HttpException('私钥解密失败或已失效', HttpStatus.NOT_FOUND)
    }
    const decrypt = new NodeRSA(privateKey)
    decrypt.setOptions({ encryptionScheme: 'pkcs1' })
    return decrypt.decrypt(data, 'utf8')
  }
}
