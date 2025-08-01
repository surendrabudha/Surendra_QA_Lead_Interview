import { setWorldConstructor, World } from '@cucumber/cucumber';
import { Browser, Page, chromium } from '@playwright/test';
import axios from 'axios';

interface CustomWorld extends World {
  browser: Browser;
  page: Page;
  api: typeof axios; // For direct API calls
  response: any; // To store API/UI response
  errorMessage: string; // To store error messages
}

class CustomWorldImpl implements CustomWorld {
  browser!: Browser;
  page!: Page;
  api = axios.create({ baseURL: 'http://localhost:3000/api' }); // Assuming API base URL
  response: any;
  errorMessage: string = '';

  constructor() {}

  async init() {
    this.browser = await chromium.launch(); // Or whichever browser you prefer
    this.page = await this.browser.newPage();
  }

  async close() {
    await this.page.close();
    await this.browser.close();
  }
}

setWorldConstructor(CustomWorldImpl);