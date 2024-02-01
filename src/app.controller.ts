import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly i18n: I18nService
  ) {}

  @Get()
  getHello(): string {
    return this.i18n.t('test.hello')
    // return this.appService.getHello();
  }

  @Get('getTestName')
  getTestName() {
    return this.configService.get('TEST_VALUES').name;
  }
}
