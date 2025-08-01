import { Before, After, IWorld } from '@cucumber/cucumber';
import { CustomWorldImpl } from './world'; // Assuming CustomWorldImpl is exported from world.ts

Before(async function (this: CustomWorldImpl) {
  await this.init();
});

After(async function (this: CustomWorldImpl) {
  await this.close();
});