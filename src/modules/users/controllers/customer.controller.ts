import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import {
  ApiBadRequestResponseCustom,
  ApiResponseCustom,
} from 'src/shared/decorators/swagger.decorator';
import { ListUserDto, ListUserQueryParamsDto } from '../dtos/list-user.dto';
import { CustomersService } from '../services/customers.service';

@ApiTags('Customer')
@Controller('customers')
@ApiBadRequestResponseCustom()
@ApiUnauthorizedResponse()
export class CustomerController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @ApiResponseCustom(ListUserDto)
  async listCustomer(@Query() listUserQueryParamsDto: ListUserQueryParamsDto) {
    return this.customersService.listCustomer(listUserQueryParamsDto);
  }
}
