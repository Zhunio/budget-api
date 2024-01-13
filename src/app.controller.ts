import { Controller, Get } from '@nestjs/common';
import packageJson from '../package.json';

@Controller()
export class AppController {
  @Get()
  getVersion(): string {
    return `Welcome to Budget API v${packageJson.version}`;
  }
}
