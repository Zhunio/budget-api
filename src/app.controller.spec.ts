import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import * as packageJson from '../package.json';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get(AppController);
  });

  describe('getVersion()', () => {
    it('should return "Welcome to Budget API vx.x.x"', () => {
      expect(appController.getVersion()).toBe(`Welcome to Budget API v${packageJson.version}`);
    });
  });
});
