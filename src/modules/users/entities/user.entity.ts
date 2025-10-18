import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { PermissionEnum } from 'src/shared/enums/permissions.enum';
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password', type: 'varchar', length: 60 })
  password: string;

  @Column({ name: 'first_name', type: 'varchar', length: 64, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 64, nullable: true })
  lastName: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({
    name: 'role_id',
    type: 'uuid',
  })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: Role;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens?: RefreshToken[];

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdByUser?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by', referencedColumnName: 'id' })
  updatedByUser?: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'deleted_by', referencedColumnName: 'id' })
  deletedByUser?: User;

  get fullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }

  hasPermission(permission: PermissionEnum): boolean {
    return this.role?.permissions?.some((p) => p.name === permission) || false;
  }

  hasAnyPermission(permissions: PermissionEnum[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  hasRole(roleId: string): boolean {
    return this.roleId === roleId;
  }

  hasAnyRole(roleIds: string[]): boolean {
    return roleIds.includes(this.roleId);
  }
}
