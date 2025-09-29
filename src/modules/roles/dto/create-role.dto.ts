import {
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
  IsUUID,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleEnum as RoleEnum } from 'src/shared/enums/roles.enum';

export class CreateRoleDto {
  @ApiProperty({ enum: RoleEnum, example: RoleEnum.STAFF })
  @IsEnum(RoleEnum)
  name: RoleEnum;

  @ApiProperty({
    example: 'Staff',
  })
  @IsString()
  displayName: string;

  @ApiPropertyOptional({
    example: 'Role for staff members',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ minimum: 1, maximum: 10, example: 1 })
  @IsInt()
  @Min(1)
  @Max(10)
  level: number;

  @ApiPropertyOptional({ type: [String], example: [] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds?: string[];
}
