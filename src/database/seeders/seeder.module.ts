import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from '../database.service';
import { Seeder } from './seeder';
import { SettingsModule } from 'src/settings/settings.module';
import { SettingsSeederService } from './settings/settings.service';
import { SettingsRepository } from 'src/settings/repository/settings.repository';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useClass: DatabaseService,
    }),
    TypeOrmModule.forFeature([SettingsRepository]),
    SettingsModule,
  ],
  providers: [Logger, Seeder, SettingsSeederService],
})
export class SeederModule {}
