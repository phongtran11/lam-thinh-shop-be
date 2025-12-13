import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { UserCustomersController } from './controllers/user-customers.controller';
import { UserCustomersRepository } from './repositories/user-customers.repository';
import { UserCustomersService } from './services/user-customers.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserCustomersController],
  providers: [UserCustomersService, UserCustomersRepository],
  exports: [UserCustomersService, UserCustomersRepository],
})
export class UserCustomersModule {}
