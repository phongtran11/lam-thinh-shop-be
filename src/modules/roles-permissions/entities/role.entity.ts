import { Entity, Column, OneToMany } from 'typeorm';
import { Permission } from 'src/modules/roles-permissions/entities/permission.entity';
import { RolePermissions } from 'src/modules/roles-permissions/entities/role-permissions.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  type ERoleHierarchy,
  type ERoles,
} from 'src/shared/constants/role.constant';
import { BaseEntity } from 'src/shared/entities/base.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 32,
    unique: true,
    comment: 'Role identifier',
  })
  name: ERoles;

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
  description: string;

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
    comment: 'Is role active',
  })
  isActive: boolean;

  @Column({ type: 'int', comment: 'Role hierarchy level' })
  level: ERoleHierarchy;

  // Relations
  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @OneToMany(() => RolePermissions, (rolePermissions) => rolePermissions.role)
  rolePermissions: RolePermissions[];

  get permissions(): Permission[] {
    return this.rolePermissions?.map((rp) => rp.permission) || [];
  }
}
