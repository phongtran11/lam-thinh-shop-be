import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(
    @InjectDataSource()
    protected readonly dataSource: DataSource,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async existsByEmail(email: string): Promise<boolean> {
    return await this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getExists();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findOneWithRoleByEmail(email: string): Promise<User | null> {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findOneByUserId(id: string): Promise<User | null> {
    return await this.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async findOneWithRoleById(id: string): Promise<User | null> {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id = :id', { id })
      .getOne();
  }

  async findPermissionNamesByUserId(userId: string): Promise<string[]> {
    const result = await this.createQueryBuilder('user')
      .leftJoin('user.role', 'role')
      .leftJoin('role.rolePermissions', 'rolePermissions')
      .leftJoin('rolePermissions.permission', 'permission')
      .where('user.id = :userId', { userId })
      .andWhere('role.is_active = :isActive', { isActive: true })
      .andWhere('permission.is_active = :isActive', { isActive: true })
      .select('permission.name', 'name')
      .getRawMany<{ name: string }>();
    return result.map((row) => row.name);
  }
}
