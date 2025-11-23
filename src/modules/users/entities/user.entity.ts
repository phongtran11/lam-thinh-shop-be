import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { RefreshToken } from 'src/modules/auth/entities/refresh-token.entity';
import { Role } from 'src/modules/roles-permissions/entities/role.entity';
import { EPermissions } from 'src/shared/constants/permission.constant';
import { BaseEntity } from 'src/shared/entities/base.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    unique: true,
    comment: 'The email of the user',
  })
  email: string;

  @Column({
    name: 'password',
    type: 'text',
    comment: 'The hashed password of the user',
  })
  password: string;

  @Column({
    name: 'first_name',
    type: 'varchar',
    length: 64,
    nullable: true,
    comment: 'The first name of the user',
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'varchar',
    length: 64,
    nullable: true,
    comment: 'The last name of the user',
  })
  lastName: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 20,
    nullable: true,
    comment: 'The phone number of the user',
  })
  phoneNumber: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'The avatar of the user',
  })
  avatar: string;

  @Column({
    name: 'role_id',
    type: 'uuid',
    comment: 'The role ID of the user',
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

  hasPermission(permission: EPermissions): boolean {
    return this.role?.permissions?.some((p) => p.name === permission) || false;
  }

  hasAnyPermission(permissions: EPermissions[]): boolean {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  hasRole(roleId: string): boolean {
    return this.roleId === roleId;
  }

  hasAnyRole(roleIds: string[]): boolean {
    return roleIds.includes(this.roleId);
  }
}
