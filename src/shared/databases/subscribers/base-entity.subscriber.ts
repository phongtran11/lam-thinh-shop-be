import { ClsService } from 'nestjs-cls';
import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { CLS_KEY } from 'src/shared/constants/cls.constant';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { JwtPayload } from 'src/shared/modules/jwt-tokens/jwt-tokens.dto';

@EventSubscriber()
export class BaseEntitySubscriber
  implements EntitySubscriberInterface<BaseEntity>
{
  constructor(private readonly clsService: ClsService) {}

  listenTo() {
    return BaseEntity;
  }

  beforeInsert(event: InsertEvent<BaseEntity>) {
    const userId = this.clsService?.get<JwtPayload>(CLS_KEY.JWT_PAYLOAD)?.sub;
    if (userId) {
      event.entity.createdBy = userId;
    }
  }

  beforeUpdate(event: UpdateEvent<BaseEntity>): Promise<any> | void {
    const userId = this.clsService?.get<JwtPayload>(CLS_KEY.JWT_PAYLOAD)?.sub;
    if (userId && event.entity) {
      event.entity.updatedBy = userId;
    }
  }

  beforeSoftRemove(event: SoftRemoveEvent<BaseEntity>): Promise<any> | void {
    const userId = this.clsService?.get<JwtPayload>(CLS_KEY.JWT_PAYLOAD)?.sub;
    if (userId && event.entity) {
      event.entity.deletedBy = userId;
    }
  }
}
