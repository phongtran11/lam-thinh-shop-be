# Lam Thinh Shop - Backend Development Guide

## Architecture Overview

This is a **NestJS + TypeORM + PostgreSQL** e-commerce backend using a **modular monolith** architecture with strong transaction patterns and RBAC (Role-Based Access Control) with permissions.

### Key Architectural Patterns

1. **Base Entity Pattern**: All entities extend `BaseEntity` (soft deletes + audit fields: `createdBy`, `updatedBy`, `deletedBy`)
   - Auto-populated via `BaseEntitySubscriber` using `nestjs-cls` context
   - UUIDs for all primary keys

2. **Base Repository Pattern**: Custom repositories extend `BaseRepository<T>`
   - Provides `buildQueryAudit()` to join user info for audit fields
   - Example: `UsersRepository`, `RefreshTokensRepository`

3. **Transaction Provider Pattern**: Complex operations use `TransactionProvider<Input[], Output>`
   - Extends abstract class in `src/shared/providers/transaction.provider.ts`
   - Creates transaction-aware repositories via `initRepository(entityManager)`
   - Example: `RegisterTransaction`, `RefreshTokenTransaction`
   - Usage: `await this.registerTransaction.execute(user, refreshToken)`

4. **Custom Swagger Decorators**: Standardized API responses
   - `@ApiResponseCustom(DtoClass)` for 200 OK with data wrapper
   - `@ApiCreatedResponseCustom(DtoClass)` for 201 Created
   - All responses wrapped in `{ statusCode, message, data }` structure

5. **Context Lifecycle (CLS)**: User context stored in `nestjs-cls` for audit tracking
   - JWT payload stored in CLS with key `CLS_JWT_PAYLOAD`
   - Accessed in subscribers, services via `ClsService`

## Module Structure

```
src/modules/{module-name}/
├── {module-name}.module.ts
├── controllers/          # REST endpoints
├── services/            # Business logic
├── repositories/        # Data access (extends BaseRepository)
├── transactions/        # Multi-step operations (extends TransactionProvider)
├── entities/            # TypeORM entities
├── dto/                 # Request/response DTOs
└── enums/               # Module-specific enums
```

## Authentication & Authorization

- **JWT Strategy**: Access token (short-lived) + Refresh token (long-lived, hashed in DB)
- **Guards Order**: `JwtAuthGuard` → `RolesGuard` → `PermissionsGuard`
- **Public Routes**: Use `@Public()` decorator to bypass JWT guard
- **Refresh Token Pattern**:
  - Tokens hashed with SHA-256 before storage
  - Revoked tokens tracked with `RefreshTokenRevokeReasonEnum`
  - Scheduled cleanup via `RefreshTokenCleanupService` (daily at 00:00)

## Database & Migrations

**Critical Commands**:

```bash
# Generate migration (must include --name)
npm run migration:gen --name=your-migration-name

# Run migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Seed database
npm run seed:run
```

**Migration Convention**:

- TypeORM auto-generates DROP/ADD for column changes - **ALWAYS review and convert to ALTER COLUMN** to preserve data
- Example: Change `varchar(60)` → `varchar(64)` using `ALTER TABLE "table" ALTER COLUMN "col" TYPE varchar(64)`

## Development Conventions

### DTOs

- Use `class-transformer` with `plainToInstance()` for serialization
- Use `class-validator` decorators for validation
- Swagger decorators on all DTO properties

### Enums

- Stored as string values in database (not integers)
- Example: `RefreshTokenRevokeReasonEnum.USER_LOGOUT = 'User Logout'`

### Error Handling

- Use NestJS built-in exceptions: `ConflictException`, `NotFoundException`, `UnauthorizedException`, etc.
- Log warnings before throwing user-facing errors
- Example: `this.logger.warn(\`Email ${email} already exists\`);`

### Scheduled Tasks

- Located in `src/modules/schedules/services/`
- Use `@Cron()` decorator with `CronExpression` enum
- Always include try-catch with proper logging

## Critical Files

- `src/shared/providers/transaction.provider.ts` - Transaction base class
- `src/shared/subscribers/base-entity.subscriber.ts` - Auto-populates audit fields
- `src/shared/guards/*.guard.ts` - Authentication & authorization
- `src/configs/database.config.ts` - TypeORM configuration with subscribers

## Build & Run

```bash
# Development
npm run start:dev

# Production build
npm run build

# Production start (CORRECTED PATH)
npm run start:prod  # Uses dist/src/main.js (not dist/main.js)
```

**Note**: NestJS with `sourceRoot: "src"` outputs to `dist/src/`, not `dist/`

## Testing

- Unit tests: `npm run test:unit`
- E2E tests: `npm run test:e2e`
- Test files use `.spec.ts` suffix

## Common Patterns to Follow

1. **Creating new entities**: Extend `BaseEntity`, create matching repository extending `BaseRepository`
2. **Multi-step operations**: Create a `TransactionProvider` subclass in `transactions/` folder
3. **New modules**: Export repositories in module for cross-module usage (see `auth.module.ts`)
4. **API endpoints**: Use custom Swagger decorators, return DTOs (never entities directly)
5. **Scheduled jobs**: Create service in `schedules/services/`, register in `SchedulesModule`
