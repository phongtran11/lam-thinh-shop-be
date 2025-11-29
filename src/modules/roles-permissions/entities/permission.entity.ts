import { Entity, Column, OneToMany } from 'typeorm';
import { RolePermissions } from 'src/modules/roles-permissions/entities/role-permissions.entity';
import {
  type Permissions,
  type Resources,
} from 'src/shared/constants/permission.constant';
import { BaseEntity } from 'src/shared/entities/base.entity';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 32,
    unique: true,
    comment: 'Permission identifier',
  })
  name: Permissions;

  @Column({
    name: 'display_name',
    type: 'varchar',
    length: 64,
    comment: 'Human-readable permission name',
  })
  displayName: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Permission description',
  })
  description: string;

  @Column({
    name: 'resource',
    type: 'varchar',
    length: 255,
    comment: 'Resource associated with the permission',
  })
  resource: Resources;

  @Column({
    name: 'is_active',
    comment: 'Is permission active',
    default: true,
  })
  isActive: boolean;

  @OneToMany(
    () => RolePermissions,
    (rolePermissions) => rolePermissions.permission,
  )
  rolePermissions: RolePermissions[];
}
