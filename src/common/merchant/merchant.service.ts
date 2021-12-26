import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';

@Injectable()
export class MerchantService {
  logger = new Logger();

  constructor(
    private readonly httpService: HttpService,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {}

  async getStore(id: string): Promise<any> {
    try {
      return await lastValueFrom(
        this.httpService
          .get(
            `${process.env.BASEURL_MERCHANTS_SERVICE}/api/v1/internal/merchants/stores/level/${id}`,
          )
          .pipe(map((resp) => resp.data)),
      );
    } catch (e) {
      this.logger.error(
        `${process.env.BASEURL_MERCHANTS_SERVICE}/api/v1/internal/merchants/stores/level/${id} ${e.message}`,
      );
      if (e.response) {
        throw new HttpException(
          e.response.data.message,
          e.response.data.statusCode,
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async merchantValidation(
    store_id: string,
    user: Record<string, any>,
  ): Promise<any> {
    const store = await this.getStore(store_id).catch((err) => {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: store_id,
            property: 'store_id',
            constraint: [
              this.messageService.get('general.general.dataInvalid'),
              err.message,
            ],
          },
          'Bad Request',
        ),
      );
    });
    if (!store) {
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: store_id,
            property: 'store_id',
            constraint: [
              this.messageService.get('general.general.dataInvalid'),
            ],
          },
          'Bad Request',
        ),
      );
    }
    if (user.level == 'store' && user.store_id != store.id) {
      throw new UnauthorizedException(
        this.responseService.error(
          HttpStatus.UNAUTHORIZED,
          {
            value: store.id,
            property: 'store_id',
            constraint: [
              this.messageService.get('general.general.invalidUserAccess'),
            ],
          },
          'Unauthorized',
        ),
      );
    }
    if (user.level == 'merchant' && user.merchant_id != store.merchant.id) {
      throw new UnauthorizedException(
        this.responseService.error(
          HttpStatus.UNAUTHORIZED,
          {
            value: user.merchant_id,
            property: 'merchant_id',
            constraint: [
              this.messageService.get('general.general.invalidUserAccess'),
            ],
          },
          'Unauthorized',
        ),
      );
    }
    if (user.level == 'group' && user.group_id != store.merchant.group_id) {
      throw new UnauthorizedException(
        this.responseService.error(
          HttpStatus.UNAUTHORIZED,
          {
            value: user.group_id,
            property: 'group_id',
            constraint: [
              this.messageService.get('general.general.invalidUserAccess'),
            ],
          },
          'Unauthorized',
        ),
      );
    }
    return store;
  }
}
