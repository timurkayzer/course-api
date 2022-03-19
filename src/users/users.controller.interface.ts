import { NextFunction, Request, Response, Router } from "express";

export interface IUserController {
    register(req: Request, res: Response, next: NextFunction): void;
    login(req: Request, res: Response, next: NextFunction): void;
    baseRoute: string;
    router: Router;
}