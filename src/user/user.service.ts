import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CacheService } from 'src/cache/cache.service';
import { User } from './entities/user.entity';
import { R } from 'src/utils/error';
import { queryUserDto } from './dto/query-user.dto';

@Injectable()
export class UserService {
  constructor(
    private cacheService: CacheService,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { userName, phoneNumber, email } = createUserDto;
    let isExist = (await this.userRepository.countBy({ userName })) > 0;
    if (isExist) {
      return R.error('当前用户名已存在');
    }

    isExist = (await this.userRepository.countBy({ phoneNumber })) > 0;
    if (isExist) {
      return R.error('当前手机号已存在');
    }

    isExist = (await this.userRepository.countBy({ email })) > 0;
    if (isExist) {
      return R.error('当前邮箱已存在');
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
    const message = user ? "添加成功" : "添加失败"
    return message
  }

  async findAll(queryUser: queryUserDto) {
    const { pageIndex, pageSize } = queryUser;
    const take = pageSize || 10;
    const skip = ((pageIndex || 1) - 1) * take;
    const count = await this.userRepository
      .createQueryBuilder('user')
      .getCount();
    const users = await this.userRepository
      .createQueryBuilder('user')
      .skip(skip)
      .take(take)
      .getMany();
    return {
      list: users,
      count,
    };
  }

  async findOne(id: number) {
    return await this.userRepository.findOneBy({ id });
    // return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw R.error('用户不存在');
    }
    const updateUser = await this.userRepository.update({ id }, updateUserDto);
    const message = updateUser ? "删除成功" : "删除失败"
    return message
    // await this.userRepository.save(updateUserDto);
  }

  async remove(id: number) {
    const user = await this.findOne(id)
    const delUser = await this.userRepository.remove(user)
    const message = delUser ? "删除成功" : "删除失败"
    return message
  }
}
