import * as Sentry from "@sentry/react";

enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

class Logger {
  private level: LogLevel;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
    this.initializeSentry();
  }

  private initializeSentry() {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.VITE_APP_ENV,
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration()
      ],
      tracesSampleRate: 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }

  debug(message: string, context?: any) {
    if (this.level === LogLevel.DEBUG) {
      console.debug(message, context);
    }
  }

  info(message: string, context?: any) {
    if ([LogLevel.DEBUG, LogLevel.INFO].includes(this.level)) {
      console.info(message, context);
    }
  }

  warn(message: string, context?: any) {
    console.warn(message, context);
    Sentry.captureMessage(message, 'warning');
  }

  error(error: Error, context?: any) {
    console.error(error, context);
    Sentry.captureException(error);
  }
}

const logger = new Logger(import.meta.env.VITE_LOGGING_LEVEL as LogLevel);
export default logger;
