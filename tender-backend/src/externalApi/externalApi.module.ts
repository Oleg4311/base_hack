import { Module } from '@nestjs/common';
import { ExternalApiService } from './externalApi.service';
import { ExternalApiController } from './externalApi.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ExternalApiController],
  providers: [ExternalApiService],
})
export class ExternalApiModule {}
