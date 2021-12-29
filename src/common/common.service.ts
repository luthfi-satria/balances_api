import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { catchError, map } from 'rxjs/operators';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class CommonService {
  constructor(private httpService: HttpService) {}

  async postHttp(
    url: string,
    body?: Record<string, any>,
    headers?: Record<string, any>,
  ): Promise<AxiosResponse<any>> {
    const post_response = this.httpService
      .post(url, body, { headers: headers })
      .pipe(
        map((axiosResponse: AxiosResponse) => {
          return axiosResponse.data;
        }),
        catchError((err) => {
          console.error('err.response ', err.response.statusText);
          throw err.response.data;
        }),
      );
    try {
      return await lastValueFrom(post_response);
    } catch (error) {
      return null;
    }
  }

  async getHttp(
    url: string,
    headers?: Record<string, any>,
  ): Promise<AxiosResponse<any>> {
    const post_response = this.httpService.get(url, { headers: headers }).pipe(
      map((axiosResponse: AxiosResponse) => {
        return axiosResponse.data;
      }),
      catchError((err) => {
        console.error(err.response.data);
        throw err.response.data;
      }),
    );
    try {
      return await firstValueFrom(post_response);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
