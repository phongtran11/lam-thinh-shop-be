import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared/shared.module';
import { CustomersController, UsersController } from './controllers';
import { User } from './entities';
import { UsersRepository } from './repositories';
import { CustomersRepository } from './repositories/customers.repository';
import { CustomersService, UsersService } from './services';

@Module({
  imports: [TypeOrmModule.forFeature([User]), SharedModule],
  controllers: [CustomersController, UsersController],
  providers: [
    CustomersService,
    CustomersRepository,
    UsersService,
    UsersRepository,
  ],
  exports: [
    CustomersService,
    CustomersRepository,
    UsersService,
    UsersRepository,
  ],
})
export class UsersModule {}
