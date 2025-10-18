import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity';
import { ClsService } from 'nestjs-cls';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { CLS_JWT_PAYLOAD } from '../enums/cls.enum';

@EventSubscriber()
export class BaseEntitySubscriber
  implements EntitySubscriberInterface<BaseEntity>
{
  constructor(private readonly clsService: ClsService) {}

  listenTo() {
    return BaseEntity;
  }

  beforeInsert(event: InsertEvent<BaseEntity>) {
    const userId = this.clsService?.get<JwtPayload>(CLS_JWT_PAYLOAD)?.sub;
    if (userId) {
      event.entity.createdBy = userId;
    }
  }

  beforeUpdate(event: UpdateEvent<BaseEntity>): Promise<any> | void {
    const userId = this.clsService?.get<JwtPayload>(CLS_JWT_PAYLOAD)?.sub;
    if (userId && event.entity) {
      event.entity.updatedBy = userId;
    }
  }

  beforeSoftRemove(event: SoftRemoveEvent<BaseEntity>): Promise<any> | void {
    const userId = this.clsService?.get<JwtPayload>(CLS_JWT_PAYLOAD)?.sub;
    if (userId && event.entity) {
      event.entity.deletedBy = userId;
    }
  }
}
