import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CommonService } from 'src/common/common.service';
import { MessageService } from 'src/message/message.service';
import { ResponseService } from 'src/response/response.service';
import { BanksController } from './banks.controller';
import { BanksService } from './banks.service';
import { CustomerBankRepository } from './repository/customer_bank.repository';

describe('BanksController', () => {
  let controller: BanksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [BanksController],
      providers: [
        BanksService,
        ResponseService,
        MessageService,
        {
          provide: getRepositoryToken(CustomerBankRepository),
          useValue: {},
        },
        CommonService,
      ],
    }).compile();

    controller = module.get<BanksController>(BanksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
