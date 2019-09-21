import { createLogger, format, transports } from 'winston';
import dayjs from 'dayjs';

const { combine, timestamp, label, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
	timestamp = dayjs(timestamp).format('MM-DD-YY HH:mm:ss');
	return `${timestamp} ${level}: ${message}`;
});

export const logger = createLogger({
	level: 'info',
	format: combine(colorize(), label({ label: 'CRASH-PAD' }), timestamp(), myFormat),
	transports: [ new transports.Console() ],
});

export default logger;