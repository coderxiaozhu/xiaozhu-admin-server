import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { CacheService } from "src/cache/cache.service";
import { User } from "./entities/user.entity";
import { queryUserDto } from "./dto/query-user.dto";
import { ApiException } from "../common/http-exception/api.exception";

@Injectable()
export class UserService {
  constructor(
    // private cacheService: CacheService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { userName, phoneNumber, email } = createUserDto;
    let isExist = (await this.userRepository.countBy({ userName })) > 0;
    if (isExist) {
      throw new HttpException('当前用户名已存在', HttpStatus.BAD_REQUEST)
    }

    isExist = (await this.userRepository.countBy({ phoneNumber })) > 0;
    if (isExist) {
      throw new HttpException('当前手机号已存在', HttpStatus.BAD_REQUEST)
    }

    isExist = (await this.userRepository.countBy({ email })) > 0;
    if (isExist) {
      throw new HttpException('当前邮箱已存在', HttpStatus.BAD_REQUEST)
    }

    let password = '';
    if (createUserDto.password) {
      password = bcrypt.hashSync(createUserDto.password, 10);
    } else {
      // 添加用户的默认密码是123456，对密码进行加盐加密
      password = bcrypt.hashSync('123456', 10);
    }
    createUserDto.password = password;
    const user = await this.userRepository.save(createUserDto);
    return user ? '添加成功' : '添加失败';
  }

  async findAll(queryUser: queryUserDto) {
    const { pageIndex, pageSize, userName, phoneNumber } = queryUser;
    const take = pageSize || 10;
    const skip = ((pageIndex || 1) - 1) * take;
    // const count = await this.userRepository
    //   .createQueryBuilder('user')
    //   .getCount();

    const userQueryBuilder = this.userRepository.createQueryBuilder('user');
    userQueryBuilder.skip(skip).take(take);
    userName && userQueryBuilder.where('user.userName = :userName', { userName })
    phoneNumber && userQueryBuilder.where('user.phoneNumber = :phoneNumber', { phoneNumber })
    const users = await userQueryBuilder.getMany();

    const count = await userQueryBuilder.getCount()
    return {
      list: users,
      count,
    };
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)
    }
    const updateUser = await this.userRepository.update({ id }, updateUserDto);
    return updateUser ? '修改成功' : '修改失败';
    // await this.userRepository.save(updateUserDto);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    const delUser = await this.userRepository.remove(user);
    return delUser ? '删除成功' : '删除失败';
  }
}
