import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './shared/decorators/public.decorator';

@ApiTags('Heath')
@Controller('heath')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  checkHealth(): string {
    return this.appService.checkHealth();
  }
}
