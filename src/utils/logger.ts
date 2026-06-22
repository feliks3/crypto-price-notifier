const log = (level: string, message: string, context?: unknown) => {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context ? { context } : {})
  };
  console.log(JSON.stringify(entry));
};

export const logger = {
  info: (message: string, context?: unknown) => log('INFO', message, context),
  warn: (message: string, context?: unknown) => log('WARN', message, context),
  error: (message: string, context?: unknown) => log('ERROR', message, context)
};
