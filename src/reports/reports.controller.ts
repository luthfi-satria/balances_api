import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ResponseStatusCode } from 'src/response/response.decorator';
import { exportExcelDto } from './dto/reports.dto';
import { ReportsService } from './reports.service';
import ExcelJS from 'exceljs';

@Controller('api/v1/balances')
export class ReportsController {
  constructor(private readonly ReportService: ReportsService) {}

  @Get('/reports')
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