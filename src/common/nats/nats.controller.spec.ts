import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from 'src/customers/customers.service';
import { MessageService } from 'src/message/message.service';
import { NatsController } from './nats.controller';

describe('NatsController', () => {
  let controller: NatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NatsController],
      providers: [
        {
          provide: CustomersService,
          useValue: {},
        },
        MessageService,
      ],
    }).compile();

    controller = module.get<NatsController>(NatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
