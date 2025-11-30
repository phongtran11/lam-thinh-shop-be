import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseOkCustom, Public } from 'src/shared';
import {
  GetCustomerItemDto,
  GetCustomersListDto,
  GetCustomersQueryDto,
} from '../dtos';
import { CustomersService } from '../services';

@Controller('customers')
@ApiTags('Customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Public()
  @ApiResponseOkCustom(GetCustomerItemDto, { isArray: true })
  async getCustomers(
    @Query() getCustomersQueryDto: GetCustomersQueryDto,
  ): Promise<GetCustomersListDto> {
    return this.customersService.getCustomers(getCustomersQueryDto);
  }
}
