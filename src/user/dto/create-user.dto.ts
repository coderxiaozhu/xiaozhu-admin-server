import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名称' })
  @IsNotEmpty({ message: '用户名称不能为空' })
  userName: string;

  @ApiProperty({ description: '用户昵称' })
  @IsNotEmpty({ message: '用户昵称不能为空' })
  nickName: string;

  @ApiProperty({ description: '手机号码' })
  @IsNotEmpty({ message: '手机号码不能为空' })
  @IsPhoneNumber()
  phoneNumber: string;

  @ApiProperty({ description: '邮箱' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '头像', nullable: true })
  avatar?: string;

  @ApiProperty({ description: '密码' })
  password: string;

  @ApiProperty({ description: '性别(0:女,1:男)', nullable: true })
  sex?: number;
}
