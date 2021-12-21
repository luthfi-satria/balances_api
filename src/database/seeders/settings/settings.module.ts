import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsDocument } from 'src/settings/entities/settings.entity';
import { SettingsSeederService } from './settings.service';

/**
 * Import and provide seeder classes for countrys.
 *
 * @module
 */
@Module({
  imports: [TypeOrmModule.forFeature([SettingsDocument])],
  providers: [SettingsSeederService],
  exports: [SettingsSeederService],
})
export class SettingsSeederModule {}
