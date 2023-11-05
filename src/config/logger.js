import winston from "winston";
import config from "./config.js";

const logger = winston.createLogger(
    {
        transports: [
            new winston.transports.Console({level: 'http'}),
            new winston.transports.File({filename: './errors.log', level: 'warn'})
        ]
    }
);

//Declare middleware
export const addLogger = (req, res, next) => {
    req.logger = logger;
    req.logger.http(`Llamado en ${req.method} en ${req.url}: fecha y hora: ${new Date().toLocaleDateString()}`);
    next();
};