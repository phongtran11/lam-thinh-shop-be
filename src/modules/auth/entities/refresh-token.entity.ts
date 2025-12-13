import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'uuid',
    name: 'user_id',
    comment: 'The ID of the user associated with the refresh token',
  })
  userId: string;

  @ManyToOne(() => User, (user) => user.refreshTokens)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    type: 'text',
    name: 'token_hash',
    comment: 'The hashed value of the refresh token',
  })
  tokenHash: string;

  @Column({
    type: 'timestamp',
    name: 'expires_at',
    comment: 'The expiration date and time of the refresh token',
  })
  expiresAt: Date;

  @Column({
    type: 'boolean',
    default: false,
    name: 'is_revoked',
    comment: 'Indicates whether the refresh token has been revoked',
  })
  isRevoked: boolean;

  @Column({
    type: 'timestamp',
    nullable: true,
    name: 'revoked_at',
    comment: 'The date and time when the refresh token was revoked',
  })
  revokedAt?: Date;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'revoke_reason',
    comment: 'The reason for revoking the refresh token',
  })
  revokeReason?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
