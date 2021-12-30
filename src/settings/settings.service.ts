import {
  BadRequestException,
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { In } from 'typeorm';
import { SettingsDocument } from './entities/settings.entity';
import { SettingsRepository } from './repository/settings.repository';
import _ from 'lodash';
import { ResponseService } from 'src/response/response.service';
import { MessageService } from 'src/message/message.service';
import { StoresService } from 'src/stores/stores.service';

@Injectable()
export class SettingsService {
  constructor(
    private readonly settingsRepository: SettingsRepository,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
    @Inject(forwardRef(() => StoresService))
    private readonly storesService: StoresService,
  ) {}

  async updateSetting(data: any) {
    const names = [];
    const paramInsert: Partial<SettingsDocument>[] = [];
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        if (!data[key]) {
          throw new BadRequestException(
            this.responseService.error(
              HttpStatus.BAD_REQUEST,
              {
                value: data[key],
                property: key,
                constraint: [
                  this.messageService.get('general.general.invalidValue'),
                ],
              },
              'Bad Request',
            ),
          );
        }

        names.push(key);
        if (Array.isArray(data[key])) {
          data[key] = JSON.stringify(data[key]);
        }
        const setting: Partial<SettingsDocument> = {
          name: key,
          value: data[key],
        };
        paramInsert.push(setting);
      }
    }
    const settings: Partial<SettingsDocument>[] = await this.getSettingsByNames(
      names,
    );

    for (let i = 0; i < paramInsert.length; i++) {
      const element = paramInsert[i];
      const index = _.findIndex(settings, { name: element.name });
      if (index >= 0) {
        settings[index].value = element.value;
        delete paramInsert[i];
      } else {
        settings.push(element);
      }
    }

    try {
      const result = await this.settingsRepository.save(settings);

      await this.storesService.createAutoDisbursement();

      return result;
    } catch (error) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: '',
            property: '',
            constraint: [
              this.messageService.get('general.general.failedUpdateData'),
              error.message,
            ],
          },
          'Bad Request',
        ),
      );
    }
  }

  async getSettingsByNames(names: string[]): Promise<SettingsDocument[]> {
    const settings = await this.settingsRepository.find({
      where: { name: In(names) },
    });
    return settings;
  }

  async getSettings(): Promise<SettingsDocument[]> {
    try {
      let settings = await this.settingsRepository.find();
      settings = await Promise.all(
        settings.map((setting) => {
          if (
            [
              'automatic_disburse_day',
              'automatic_disburse_date',
              'automatic_disburse_time',
            ].includes(setting.name)
          ) {
            setting.value = JSON.parse(setting.value);
          }
          return setting;
        }),
      );
      return settings;
    } catch (error) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: '',
            property: '',
            constraint: [
              this.messageService.get('general.general.failedFetchData'),
              error.message,
            ],
          },
          'Bad Request',
        ),
      );
    }
  }
}
