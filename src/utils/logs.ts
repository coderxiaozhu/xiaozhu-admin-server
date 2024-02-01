import { utilities } from "nest-winston";
import { createLogger } from "winston";
import * as winston from 'winston'
import 'winston-daily-rotate-file'

export const logInstance = createLogger({
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                utilities.format.nestLike()
            )
        }),
        new winston.transports.DailyRotateFile({
            level: 'warn',
            dirname: 'logs',
            filename: 'application-%DATE%.log',
            datePattern: 'YYYY-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple()
            )
        }),
        new winston.transports.DailyRotateFile({
            level: 'info',
            dirname: 'logs',
            filename: 'info-%DATE%.log',
            datePattern: 'YYYY-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.simple()
            )
        })
    ]
})
