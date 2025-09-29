import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { RoleEnum } from 'src/shared/enums/roles.enum';
import { PermissionEnum } from 'src/shared/enums/permissions.enum';
import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ name: 'email', unique: true })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column({ name: 'first_name', type: 'varchar', length: 64, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 64, nullable: true })
  lastName: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  avatar: string;

  @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
  refreshTokens?: RefreshToken[];

  @Column({
    name: 'role_name',
    type: 'varchar',
    length: 32,
  })
  roleName: RoleEnum;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_name', referencedColumnName: 'name' })
  role: Role;

  get fullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }

  hasPermission(permission: PermissionEnum): boolean {
    return this.role?.permissions?.some((p) => p.name === permission) || false;
  }

  hasAnyPermission(permissions: PermissionEnum[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  hasRole(role: RoleEnum): boolean {
    return this.roleName === role;
  }

  hasAnyRole(roles: RoleEnum[]): boolean {
    return roles.includes(this.roleName);
  }
}
