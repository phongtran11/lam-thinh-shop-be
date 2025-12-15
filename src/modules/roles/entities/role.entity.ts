import { Entity, Column, OneToMany } from 'typeorm';
import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { type Roles } from '../types/role.type';
import { RolePermissions } from './role-permissions.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 32,
    unique: true,
    comment: 'Role identifier',
  })
  name: Roles;

  @Column({
    name: 'display_name',
    type: 'varchar',
    length: 64,
    comment: 'Human-readable role name',
  })
  displayName: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Role description',
  })
  description?: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
    comment: 'Is role active',
  })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @OneToMany(() => RolePermissions, (rolePermissions) => rolePermissions.role)
  rolePermissions: RolePermissions[];

  get permissions(): Permission[] {
    return this.rolePermissions?.map((rp) => rp.permission) || [];
  }
}
