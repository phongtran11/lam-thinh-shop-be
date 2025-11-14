import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { SharedModule } from 'src/shared/shared.module';
import { CustomerController } from './controllers/customer.controller';
import { CustomersService } from './services/customers.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SharedModule],
  controllers: [UsersController, CustomerController],
  providers: [UsersService, CustomersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
