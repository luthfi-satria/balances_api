import { NatsTransportStrategy } from '@alexy4744/nestjs-nats-jetstream-transporter';
import { BadRequestException, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CustomStrategy } from '@nestjs/microservices';
import { AppModule } from './app.module';

const logger = new Logger('main');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        return new BadRequestException(
          errors.map((err) => {
            const { value, property, constraints } = err;
            return { value, property, constraints: Object.values(constraints) };
          }),
        );
      },
    }),
  );

  const microservice = app.connectMicroservice<CustomStrategy>({
    strategy: new NatsTransportStrategy({
      connection: {
        servers: process.env.NATS_SERVERS.split(','),
      },
      streams: [
        {
          name: 'balances',
          subjects: [
            'balances.order.*',
            'balances.disbursement.customer.*',
            'balances.disbursement.store.*',
          ],
        },
      ],
      consumer: (opt) => {
        // durable
        opt.durable('balances');

        // queue group
        opt.queue('balances');
      },
    }),
  });

  microservice.listen();

  app.listen(process.env.HTTP_PORT || 4010, () => {
    logger.log(`Running on ${process.env.HTTP_PORT || 4010}`);
  });
}
bootstrap();
