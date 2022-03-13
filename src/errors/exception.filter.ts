import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../logger/logger.service";
import { IExceptionFilter } from "./exception.filter.interface";
import { HttpError } from "./http-error";

export class ExceptionFilter implements IExceptionFilter {
    private logger: LoggerService;

    constructor(logger: LoggerService) {
        this.logger = logger;
    }

    public catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction) {
        if (err instanceof HttpError) {
            this.logger.error(`[${err.context}] Ошибка ${err.statusCode}: ${err.message}`);
            res.status(err.statusCode).send({ err: err.message });
        }
        else {
            this.logger.error(`${err.message}`);
            res.status(500).send({ err: err.message });
        }


    }
}