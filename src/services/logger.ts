/* eslint-disable @typescript-eslint/no-explicit-any */
import { APP_ENV } from '@/configs';

const logger = {
  logLevel: 'info', // Set the default log level

  setLogLevel: function (level: string) {
    this.logLevel = level;
  },

  log: function (level: string, ...args: any) {
    const levels = ['debug', 'info', 'warn', 'error'];
    const levelIndex = levels.indexOf(level);
    const currentLevelIndex = levels.indexOf(this.logLevel);

    if (levelIndex >= currentLevelIndex) {
      // eslint-disable-next-line no-console
      console.log(`logLevel: [${level.toUpperCase()}]`);
      console.log(...args);

      if (level === 'error') {
        // Send log to server
      }
    }
  },

  debug: function (...args: any) {
    this.log('debug', ...args);
  },

  info: function (...args: any) {
    this.log('info', ...args);
  },

  warn: function (...args: any) {
    this.log('warn', ...args);
  },

  error: function (...args: any) {
    this.log('error', ...args);
  },
};

const currentLogLevel = APP_ENV === 'production' ? 'info' : 'debug';
logger.setLogLevel(currentLogLevel);

export default logger;
