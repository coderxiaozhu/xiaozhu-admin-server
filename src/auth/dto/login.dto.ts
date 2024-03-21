import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: "用户名" })
  @IsNotEmpty({ message: "用户名不能为空" })
  accountName: string

  @ApiProperty({ description: "密码" })
  @IsNotEmpty({ message: "密码不能为空" })
  password: string

  @ApiProperty({ description: "验证码" })
  @IsNotEmpty({ message: "验证码不能为空" })
  captcha: string

  @ApiProperty({ description: "公钥" })
  @IsNotEmpty({ message: "公钥不能为空" })
  publicKey: string
}
