import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    name: 'user_id',
  })
  userId: string;

  @ManyToOne(() => User, (user) => user.refreshTokens, {
    cascade: ['soft-remove', 'remove'],
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'varchar',
    length: 500,
    unique: true,
    name: 'token',
  })
  token: string;

  @Column({
    type: 'timestamp',
    name: 'expires_at',
  })
  expiresAt: Date;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_revoked',
  })
  isRevoked: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'revoked_at',
  })
  revokedAt?: Date;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'revoke_reason',
  })
  revokeReason?: string;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: true,
    name: 'ip_address',
  })
  ipAddress?: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'user_agent',
  })
  userAgent?: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'last_used_at',
  })
  lastUsedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
