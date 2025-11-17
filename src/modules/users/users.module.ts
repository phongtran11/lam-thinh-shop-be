import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerController } from 'src/modules/users/controllers/customer.controller';
import { UsersController } from 'src/modules/users/controllers/users.controller';
import { User } from 'src/modules/users/entities/user.entity';
import { UsersRepository } from 'src/modules/users/repositories/users.repository';
import { CustomersService } from 'src/modules/users/services/customers.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SharedModule],
  controllers: [UsersController, CustomerController],
  providers: [UsersService, CustomersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
