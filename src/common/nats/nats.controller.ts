import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CustomersService } from 'src/customers/customers.service';

@Controller('nats')
export class NatsController {
  logger = new Logger(NatsController.name);

  constructor(private readonly customersService: CustomersService) {}

  @EventPattern('orders.order.cancelled_by_customer')
  async orderCancelledByCustomer(@Payload() data: any) {
    this.logger.log('orders.order.cancelled_by_customer');
    console.log('payload: ', data);
    this.customersService.saveCustomerRefund(data);
  }

  @EventPattern('orders.order.cancelled_by_store.stocks')
  async orderCancelledByStoreStocks(@Payload() data: any) {
    this.logger.log('orders.order.cancelled_by_store.stocks');
    console.log('payload: ', data);
    this.customersService.saveCustomerRefund(data);
  }

  @EventPattern('orders.order.cancelled_by_store.operational')
  async orderCancelledByStoreOperational(@Payload() data: any) {
    this.logger.log('orders.order.cancelled_by_store.operational');
    console.log('payload: ', data);
    this.customersService.saveCustomerRefund(data);
  }

  @EventPattern('orders.order.cancelled_by_store.busy')
  async orderCancelledByStoreBusy(@Payload() data: any) {
    this.logger.log('orders.order.cancelled_by_store.busy');
    console.log('payload: ', data);
    this.customersService.saveCustomerRefund(data);
  }

  @EventPattern('orders.order.cancelled_by_store.other')
  async orderCancelledByStoreOther(@Payload() data: any) {
    this.logger.log('orders.order.cancelled_by_store.other');
    console.log('payload: ', data);
    this.customersService.saveCustomerRefund(data);
  }
}
