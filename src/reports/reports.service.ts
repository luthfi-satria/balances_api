import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { firstValueFrom, map } from 'rxjs';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { exportExcelDto } from './dto/reports.dto';
import { StoreBalanceReportRepository } from './repository/store_reports.repository';

@Injectable()
export class ReportsService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
    private readonly storeReportRepo: StoreBalanceReportRepository,
    private readonly httpService: HttpService,
  ) {}
  private readonly logger = new Logger(ReportsService.name);

  async exportExcel(param: exportExcelDto) {
    try {
      const storeBalance = await this.storeReportRepo.getBalanceHistory(param);

      const excelObjects = await this.mappingStoresWithBalanceData(
        storeBalance,
      );

      return this.createExcelObjects(param, excelObjects);
    } catch (error) {
      this.logger.log(error);
      throw new BadRequestException(
        this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: '',
            property: '',
            constraint: [
              this.messageService.get('general.list.fail'),
              error.message,
            ],
          },
          'Bad Request',
        ),
      );
    }
  }

  async mappingStoresWithBalanceData(storeBalance: any) {
    const store = {};
    const xlsObjects = [];
    const rearrangeStore = [];

    if (storeBalance.length > 0) {
      for (let index = 0; index < storeBalance.length; index++) {
        store[storeBalance[index].store_id] = storeBalance[index].store_id;
      }
      const storeData = {
        limit: Object.keys(store).length,
        store_id: Object.keys(store),
        target: 'assigned',
      };

      const storeResult = await this.callMerchantsStoreAPI(storeData);
      if (storeResult.items) {
        for (let index = 0; index < storeResult.items.length; index++) {
          const storeItems = storeResult.items[index];
          rearrangeStore[storeItems.id] = {
            Corporate: storeItems.merchant.group.name,
            Brand: storeItems.merchant.name,
            Store: storeItems.name,
          };
        }

        for (let index = 0; index < storeBalance.length; index++) {
          xlsObjects.push({
            Corporate: rearrangeStore[storeBalance[index].store_id].Corporate,
            Brand: rearrangeStore[storeBalance[index].store_id].Brand,
            Store: rearrangeStore[storeBalance[index].store_id].Store,
            Recorded_at: storeBalance[index].recorded_at,
            Eligible_at: storeBalance[index].eligible_at,
            Amount: Math.abs(storeBalance[index].amount),
            Status: storeBalance[index].status,
          });
        }
      }
    }

    return xlsObjects;
  }

  async callMerchantsStoreAPI(storedata: any) {
    // Communicate with merchants service
    try {
      const headerRequest = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const url = `${process.env.BASEURL_MERCHANTS_SERVICE}/api/v1/internal/merchants/stores/multi-criteria`;

      const targetStatus = await firstValueFrom(
        this.httpService
          .post(url, storedata, headerRequest)
          .pipe(map((resp) => resp.data)),
      );

      return targetStatus;
    } catch (error) {
      throw error;
    }
  }

  async createExcelObjects(param, excelObjects) {
    if (!excelObjects) {
      throw new NotFoundException('No data to download');
    }

    const rows = [];
    excelObjects.forEach((doc) => {
      rows.push(Object.values(doc));
    });

    return {
      ObjData: excelObjects,
      rows: rows,
    };
  }

  async stylingSheetDisbursement() {
    const style = {
      font: {
        size: 11.05,
        bold: true,
      },
      border: {
        style: 'thin',
        color: {
          argb: '000000',
        },
      },
    };
    return style;
  }
}
