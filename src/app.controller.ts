import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getVersion(): string {
    return 'Welcome to Budget API v0.0.2-beta.1';
  }
}
