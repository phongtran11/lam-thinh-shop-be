import { Brackets, DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import { ROLES } from 'src/shared/constants/role.constant';

@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(protected readonly dataSource: DataSource) {
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

  async findOneWithRolePermissionsById(id: string): Promise<User | null> {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id = :id', { id })
      .getOne();
  }

  async findOneWithRolePermissionById(id: string): Promise<User | null> {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role', 'role.is_active = :isActive', {
        isActive: true,
      })
      .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
      .leftJoinAndSelect(
        'rolePermissions.permission',
        'permission',
        'permission.is_active = :isActive',
        { isActive: true },
      )
      .where('user.id = :id', { id })
      .getOne();
  }

  async findUsersByCondition(
    skip: number,
    take: number,
  ): Promise<[User[], number]> {
    return await this.createQueryBuilder('user')
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async findCustomersByCondition(
    skip: number,
    take: number,
    keywords?: string,
  ): Promise<[User[], number]> {
    const qb = this.createQueryBuilder('user').leftJoin('user.role', 'role');

    qb.where('role.name = :customerRole', { customerRole: ROLES.CUSTOMER });

    if (keywords) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(user.firstName) LIKE LOWER(:keywords)', {
            keywords: `%${keywords}%`,
          })
            .orWhere('LOWER(user.lastName) LIKE LOWER(:keywords)', {
              keywords: `%${keywords}%`,
            })
            .orWhere('LOWER(user.email) LIKE LOWER(:keywords)', {
              keywords: `%${keywords}%`,
            })
            .orWhere('user.phoneNumber LIKE :keywords', {
              keywords: `%${keywords}%`,
            });
        }),
      );
    }

    return qb.skip(skip).take(take).getManyAndCount();
  }
}
