import winston, { format } from 'winston';


export let logger;


const customLevelsOptions = {
    levels: {
        fatal: 0,
        error :1,
        warning : 2,
        info : 3,
        http:4,
        debug : 5
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "cyan",
        http: "green",
        debug: "blue"
    }
}


const buildProdLogger = () =>{
    const logger = winston.createLogger({
        level:customLevelsOptions.levels,
        transports: [
            new winston.transports.Console({
                level:'info',
                format:format.combine(
                winston.format.colorize({colors:customLevelsOptions.colors}),
                winston.format.simple()
                )}),  //logea a partir del nivel info
            new winston.transports.File({
                filename: './errors.log',
                level:'error'
            })
        ]
    })

    return logger
}


const buildDevLogger = () =>{
    const logger = winston.createLogger({
        level:customLevelsOptions.levels,
        transports: [
            new winston.transports.Console({
                level:'debug',
                format:format.combine(
                    winston.format.colorize({colors:customLevelsOptions.colors}),
                    winston.format.simple()
                )}), // Logea a partir del nivel debug
            new winston.transports.File({maxFiles:"10",filename:'./file.log',level: 'warn'}),
            new winston.transports.File({
                filename: './errors.log',
                level:'error'
            })
        ]
    })
    return logger
}

if (process.env.ENV === 'production'){
    logger = buildProdLogger();
    logger.info('Setiado en production')
}else{
    logger = buildDevLogger();
    logger.info('Setiado en desarrollo')
}



export const addLogger = (req,res,next)=>{
    req.logger= logger;
    next()
}