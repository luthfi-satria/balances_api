import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { BalancesService } from 'src/balances/balances.service';
import { CustomersService } from 'src/customers/customers.service';
import { StoresService } from 'src/stores/stores.service';

@Controller('nats')
export class NatsController {
  logger = new Logger(NatsController.name);

  constructor(
    private readonly customersService: CustomersService,
    private readonly balancesService: BalancesService,
    private readonly storesService: StoresService,
  ) {}

  @EventPattern('orders.order.cancelled_by_customer')
  async orderCancelledByCustomer(@Payload() data: any) {
    this.logger.log('orders.order.cancelled_by_customer');
    this.customersService.saveCustomerRefund(data);
  }

  @EventPattern('orders.order.cancelled_by_store.stocks')
  async orderCancelledByStoreStocks(@Payload() data: any) {
    this.logger.log('orders.order.cancelled_by_store.stocks');
    this.customersService.saveCustomerRefund(data);
  }

  @EventPattern('orders.order.cancelled_by_store.operational')
  async orderCancelledByStoreOperational(@Payload() data: any) {
    this.logger.log('orders.order.cancelled_by_store.operational');
    this.customersService.saveCustomerRefund(data);
  }

  @EventPattern('orders.order.cancelled_by_store.busy')
  async orderCancelledByStoreBusy(@Payload() data: any) {
    this.logger.log('orders.order.cancelled_by_store.busy');
    this.customersService.saveCustomerRefund(data);
  }

  @EventPattern('orders.order.cancelled_by_store.other')
  async orderCancelledByStoreOther(@Payload() data: any) {
    this.logger.log('orders.order.cancelled_by_store.other');
    this.customersService.saveCustomerRefund(data);
  }

  @EventPattern('orders.order.cancelled_by_system')
  async orderCancelledBySystem(@Payload() data: any) {
    this.logger.log('orders.order.cancelled_by_system');
    this.customersService.saveCustomerRefund(data);
  }

  @EventPattern('orders.order.cancelled_by_admin')
  async orderCancelledByAdmin(@Payload() data: any) {
    this.logger.log('orders.order.cancelled_by_admin');
    this.customersService.saveCustomerRefund(data);
  }

  @EventPattern('orders.order.completed')
  async orderCompleted(@Payload() data: any) {
    this.logger.log('orders.order.completed');
    this.storesService.saveOrderComplete(data);
  }

  @EventPattern('payments.disbursement.success')
  async paymentDisbursementSuccess(@Payload() data: any) {
    this.logger.log('payments.disbursement.success');
    this.balancesService.paymentDisbursementStatus(data, true);
  }

  @EventPattern('payments.disbursement.failed')
  async paymentDisbursementFailed(@Payload() data: any) {
    this.logger.log('payments.disbursement.failed');
    this.balancesService.paymentDisbursementStatus(data, false);
  }
}
