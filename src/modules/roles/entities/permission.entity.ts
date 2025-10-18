import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Role } from './role.entity';
import {
  PermissionEnum,
  ResourceEnum,
} from 'src/shared/enums/permissions.enum';
import { RolePermissions } from './role-permissions.entity';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 32,
    unique: true,
    comment: 'Permission identifier',
  })
  name: PermissionEnum;

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
  resource: ResourceEnum;

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

  get roles(): Role[] {
    return this.rolePermissions?.map((rp) => rp.role) || [];
  }
}
