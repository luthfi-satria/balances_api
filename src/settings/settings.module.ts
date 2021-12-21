import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResponseService } from 'src/response/response.service';
import { MessageService } from 'src/message/message.service';
import { SettingsRepository } from './repository/settings.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SettingsRepository])],
  providers: [SettingsService, ResponseService, MessageService],
  controllers: [SettingsController],
})
export class SettingsModule {}
