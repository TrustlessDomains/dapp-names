import { APP_ENV } from "@/configs";

const logger = {
  logLevel: 'info', // Set the default log level

  setLogLevel: function (level: string) {
    this.logLevel = level;
  },

  log: function (level: string, message: unknown) {
    const levels = ['debug', 'info', 'warn', 'error'];
    const levelIndex = levels.indexOf(level);
    const currentLevelIndex = levels.indexOf(this.logLevel);

    if (levelIndex >= currentLevelIndex) {
      // eslint-disable-next-line no-console
      console.log(`[${level.toUpperCase()}]`, message);

      if (level === 'error') {
        // Send log to server
      }
    }
  },

  debug: function (message: unknown) {
    this.log('debug', message);
  },

  info: function (message: unknown) {
    this.log('info', message);
  },

  warn: function (message: unknown) {
    this.log('warn', message);
  },

  error: function (message: unknown) {
    this.log('error', message);
  },
};

const currentLogLevel = APP_ENV === 'production' ? 'info' : 'debug';
logger.setLogLevel(currentLogLevel);

export default logger;
