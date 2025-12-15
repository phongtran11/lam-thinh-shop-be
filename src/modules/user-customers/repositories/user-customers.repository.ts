import { Brackets, DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { ROLES } from 'src/modules/roles/constants/role.constant';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class UserCustomersRepository extends Repository<User> {
  constructor(
    @InjectDataSource()
    protected readonly dataSource: DataSource,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async findCustomersAndCount(
    skip: number,
    take: number,
    keyword?: string,
  ): Promise<[User[], number]> {
    const qb = this.createQueryBuilder('user').innerJoin(
      'user.role',
      'role',
      'role.name = :customerRole',
      {
        customerRole: ROLES.CUSTOMER,
      },
    );

    if (keyword) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('user.firstName ILIKE :keyword')
            .orWhere('user.lastName ILIKE :keyword')
            .orWhere('user.email ILIKE :keyword')
            .orWhere('user.phoneNumber ILIKE :keyword');
        }),
      ).setParameters({ keyword: `%${keyword}%` });
    }

    return qb
      .orderBy('user.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }
}
