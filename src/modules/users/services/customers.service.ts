import { plainToInstance } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { GetCustomersListDto, GetCustomersQueryDto } from '../dtos';
import { CustomersRepository } from '../repositories/customers.repository';
import { GetCustomerItemDto } from './../dtos/customers.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly customersRepository: CustomersRepository) {}

  async getCustomers(
    getCustomersQueryDto: GetCustomersQueryDto,
  ): Promise<GetCustomersListDto> {
    const [customers, totalItem] =
      await this.customersRepository.findCustomersAndCount(
        getCustomersQueryDto.skip,
        getCustomersQueryDto.take,
        getCustomersQueryDto.keyword,
      );

    return plainToInstance(GetCustomersListDto, {
      items: plainToInstance(GetCustomerItemDto, customers),
      page: getCustomersQueryDto.page,
      limit: getCustomersQueryDto.take,
      totalItem,
      totalPage: Math.ceil(totalItem / getCustomersQueryDto.take),
    });
  }
}
