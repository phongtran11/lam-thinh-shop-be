import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'first_name', type: 'varchar', length: 64 })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 64 })
  lastName: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20 })
  phoneNumber: string;
}
