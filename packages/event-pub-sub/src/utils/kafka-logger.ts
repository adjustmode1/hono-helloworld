import { logLevel }  from 'kafkajs';
import {getLogger} from "@packages/common";
const toWinstonLogLevel = level => {
    switch(level) {
        case logLevel.ERROR:
        case logLevel.NOTHING:
            return 'error'
        case logLevel.WARN:
            return 'warn'
        case logLevel.INFO:
            return 'info'
        case logLevel.DEBUG:
            return 'debug'
        default:
            return 'error';
    }
}

export const WinstonLogCreator = logLevel => {
   const logger = getLogger('Kafka');

    return ({ namespace, level, label, log }) => {
        const { message, ...extra } = log
        logger.log({
            level: toWinstonLogLevel(level),
            message,
            extra,
        })
    }
}
