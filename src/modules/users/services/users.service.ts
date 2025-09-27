import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { UserDto } from '../dto/user.response.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const newUser = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return plainToInstance(UserDto, newUser);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.findAll();
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.usersRepository.findOne(id);
    return plainToInstance(UserDto, user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.usersRepository.findByEmail(email);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const user = await this.usersRepository.update(id, updateUserDto);
    return plainToInstance(UserDto, user);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.remove(id);
  }
}
