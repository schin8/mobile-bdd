import { createLogger, format, transports } from 'winston';

const level = process.env.LOG_LEVEL ?? 'info';

const LEVEL_COLORS: Record<string, string> = {
  error: '\x1b[1;31m', // bold red
  warn: '\x1b[1;33m', // bold yellow
  info: '\x1b[1;34m', // bold blue
  debug: '\x1b[34m', // blue
};
const DIM = '\x1b[90m'; // gray for timestamp
const RESET = '\x1b[0m';

export const logger = createLogger({
  level,
  format: format.combine(
    format.timestamp({ format: 'YY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message }) => {
      const color = LEVEL_COLORS[level] ?? RESET;
      const tag = level.toUpperCase().padEnd(5);
      return `${DIM}${timestamp}${RESET} [${color}${tag}${RESET}] ${message}`;
    }),
  ),
  transports: [new transports.Console()],
});
