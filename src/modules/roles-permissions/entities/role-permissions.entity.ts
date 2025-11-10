import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Entity('role_permissions')
export class RolePermissions {
  @PrimaryColumn({
    name: 'role_id',
    type: 'uuid',
    comment: 'Associated role ID',
  })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.rolePermissions)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role;

  @PrimaryColumn({
    name: 'permission_id',
    type: 'uuid',
    comment: 'Associated permission ID',
  })
  permissionId: string;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions)
  @JoinColumn({ name: 'permission_id', referencedColumnName: 'id' })
  permission: Permission;
}
