import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Permission } from './permission.entity';
import { RoleEnum as RoleEnum } from 'src/shared/enums/roles.enum';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 32,
    unique: true,
  })
  name: RoleEnum;

  @Column({
    name: 'display_name',
    type: 'varchar',
    length: 64,
  })
  displayName: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  description: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'int', default: 1 })
  level: number; // For role hierarchy

  // Relations
  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    cascade: true,
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];
}
