import { Injectable } from '@nestjs/common';
import languages from './message.constant';

@Injectable()
export class MessageService {
  private readonly languages: Record<string, any> = languages;

  // constructor() {}

  get(key: string): string {
    // Env Variable
    const defaultMessage = process.env.APP_LANGUAGE;
    const keys: string[] = key.split('.');
    let selectedMessage: Record<string, any> | string =
      this.languages[defaultMessage];

    for (const i of keys) {
      selectedMessage = selectedMessage[i];

      if (!selectedMessage) {
        selectedMessage = key;
        break;
      }
    }

    return selectedMessage as string;
  }

  getjson(data: Record<string, any> | string): string {
    return data as string;
  }

  getLang(key: string): string {
    // Env Variable
    const keys: string[] = key.split('.');
    let selectedMessage: Record<string, any> | string = this.languages;

    for (const i of keys) {
      selectedMessage = selectedMessage[i];

      if (!selectedMessage) {
        selectedMessage = key;
        break;
      }
    }

    return selectedMessage as string;
  }
}
