import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MessageService } from 'src/message/message.service';
import {
  IResponseError,
  IResponsePaging,
  RMessage,
  RSuccessMessage,
} from './response.interface';

@Injectable()
export class ResponseService {
  constructor(private readonly messageService: MessageService) {}

  error(
    statusCode: number,
    message: RMessage,
    errors?: string,
  ): IResponseError {
    if (errors) {
      return {
        statusCode: statusCode,
        message: [message],
        error: errors,
      };
    }

    return {
      statusCode: statusCode,
      message: [message],
    };
  }

  success(
    success: boolean,
    message: string,
    data?: Record<string, any> | Record<string, any>[],
  ): RSuccessMessage {
    if (data) {
      return {
        success: true,
        message: message,
        data: data,
      };
    }

    return {
      success: true,
      message: message,
    };
  }

  paging(
    message: string,
    totalData: number,
    totalPage: number,
    currentPage: number,
    perPage: number,
    data: Record<string, any>[],
  ): IResponsePaging {
    return {
      message,
      totalData,
      totalPage,
      currentPage,
      perPage,
      data,
    };
  }

  async httpExceptionHandling(
    value: any,
    property: string,
    message: string,
    statusCode: number,
  ): Promise<BadRequestException> {
    const messageData = {
      value: value,
      property: property,
      constraint: [this.messageService.get(message)],
    };
    if (statusCode == 404) {
      return new NotFoundException(
        this.error(HttpStatus.NOT_FOUND, messageData, 'NOT FOUND'),
      );
    } else {
      return new BadRequestException(
        this.error(HttpStatus.BAD_REQUEST, messageData, 'BAD REQUEST'),
      );
    }
  }
}
