import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BalancesService } from 'src/balances/balances.service';

@Controller('nats')
export class NatsController {
  logger = new Logger(NatsController.name);

  constructor(private readonly balancesService: BalancesService) {}

  @EventPattern('orders.order.cancelled_by_customer')
  @EventPattern('orders.order.cancelled_by_store.stocks')
  @EventPattern('orders.order.cancelled_by_store.operational')
  @EventPattern('orders.order.cancelled_by_store.busy')
  @EventPattern('orders.order.cancelled_by_store.other')
  async saveMenuEfood(@Payload() data: any) {
    this.logger.log('orders.order.accepted');
    this.balancesService.saveCustomerRefund(data);
  }
}
