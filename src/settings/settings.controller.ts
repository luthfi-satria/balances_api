import { Body, Controller, Get, Put } from '@nestjs/common';
import { AuthJwtGuard } from 'src/auth/auth.decorator';
import { MessageService } from 'src/message/message.service';
import { ResponseStatusCode } from 'src/response/response.decorator';
import { RSuccessMessage } from 'src/response/response.interface';
import { ResponseService } from 'src/response/response.service';
import { SettingsService } from './settings.service';
import { SettingsDto } from './dto/settings.dto';
import { UserType } from 'src/auth/guard/user-type.decorator';

@Controller('api/v1/balances/settings/balances')
export class SettingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {}

  @Get()
  @UserType('admin')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async getSetting(): Promise<RSuccessMessage> {
    const result = await this.settingsService.getSettings();
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
      result,
    );
  }

  @Put()
  @UserType('admin', 'merchant', 'customer')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async updateSetting(
    @Body() settingDto: SettingsDto,
    @Body() payload: Record<string, any>,
  ): Promise<RSuccessMessage> {
    const result = await this.settingsService.updateSetting(payload);
    return this.responseService.success(
      true,
      this.messageService.get('general.general.success'),
      result,
    );
  }
}
