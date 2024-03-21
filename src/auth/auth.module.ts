import { Module } from "@nestjs/common";
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { CacheModule } from "../cache/cache.module";
import { RsaService } from '../services/rsa.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, RsaService],
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule,
  ]
})
export class AuthModule {}
