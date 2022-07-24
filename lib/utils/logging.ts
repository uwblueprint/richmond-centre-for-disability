import pino from 'pino';

// Create pino logger
const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  formatters: {
    level: (label, _number) => ({ level: label }),
  },
});

export default logger;
