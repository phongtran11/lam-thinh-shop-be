import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Role } from './role.entity';
import { PermissionEnum as PermissionEnum } from 'src/shared/enums/permissions.enum';

@Entity('permissions')
export class Permission extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 32,
    unique: true,
  })
  name: PermissionEnum;

  @Column({ name: 'display_name', type: 'varchar', length: 64 })
  displayName: string;

  @Column({ name: 'description', type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ name: 'resource', type: 'varchar', length: 255 })
  resource: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  // Relations
  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
