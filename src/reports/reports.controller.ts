import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ResponseStatusCode } from 'src/response/response.decorator';
import { exportExcelDto } from './dto/reports.dto';
import { ReportsService } from './reports.service';
import ExcelJS from 'exceljs';
import { UserType } from 'src/auth/guard/user-type.decorator';
import { AuthJwtGuard } from 'src/auth/auth.decorator';

@Controller('api/v1/balances')
export class ReportsController {
  constructor(private readonly ReportService: ReportsService) {}

  @Get('/reports')
  // @AuthJwtGuard()
  // @UserType('admin', 'merchant')
  @ResponseStatusCode()
  async exportExcel(@Query() param: exportExcelDto, @Res() res: Response) {
    try {
      const excelObjects = await this.ReportService.exportExcel(param);

      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'Efood';

      // add worksheet
      const sheetDisbursement = workbook.addWorksheet(param.type, {
        properties: { defaultColWidth: 20 },
      });

      // add header
      if (excelObjects && !excelObjects.ObjData[0]) {
        excelObjects.ObjData[0] = {
          Corporate: '',
          Brand: '',
          Store: '',
          Recorded_at: '',
          Eligible_at: '',
          Amount: '',
          Status: '',
        };
        excelObjects.rows = [['Data is empty', '', '', '', '', '', '']];
      }
      excelObjects.rows.unshift(Object.keys(excelObjects.ObjData[0]));

      // assign data to rows
      sheetDisbursement.addRows(excelObjects.rows);

      // styling
      const style = await this.ReportService.stylingSheetDisbursement();
      sheetDisbursement.getRow(1).font = style.font;
      sheetDisbursement.getRow(1).alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };

      const fileName = `${param.type}.xlsx`;

      res.set({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=' + `${fileName}`,
      });

      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
