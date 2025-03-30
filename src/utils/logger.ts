import { NextResponse } from 'next/server';

// Define log levels
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Interface for log entries
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: Error;
}

// Format log entry for consistent output
function formatLogEntry(entry: LogEntry): string {
  const context = entry.context ? ` | context: ${JSON.stringify(entry.context)}` : '';
  const errorStack = entry.error?.stack ? `\n${entry.error.stack}` : '';
  return `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}${context}${errorStack}`;
}

// Core logging function
function log(level: LogLevel, message: string, error?: Error, context?: Record<string, any>) {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    context,
    error
  };

  const formattedLog = formatLogEntry(entry);

  // In production, you might want to send logs to a service like Datadog, CloudWatch, etc.
  if (process.env.NODE_ENV === 'production') {
    // For now, we'll just use console methods
    switch (level) {
      case 'debug':
        console.debug(formattedLog);
        break;
      case 'info':
        console.info(formattedLog);
        break;
      case 'warn':
        console.warn(formattedLog);
        break;
      case 'error':
        console.error(formattedLog);
        break;
    }
  } else {
    // In development, always use console for easier debugging
    console.log(formattedLog);
  }
}

// Export logger object with methods for each log level
export const logger = {
  debug: (message: string, context?: Record<string, any>) => log('debug', message, undefined, context),
  info: (message: string, context?: Record<string, any>) => log('info', message, undefined, context),
  warn: (message: string, error?: Error, context?: Record<string, any>) => log('warn', message, error, context),
  error: (message: string, error?: Error, context?: Record<string, any>) => log('error', message, error, context),
  
  // Helper for handling API errors and returning appropriate response
  apiError: (error: Error, context?: Record<string, any>) => {
    logger.error('API Error', error, context);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}; 