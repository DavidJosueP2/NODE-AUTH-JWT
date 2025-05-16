import { Router } from "express";
import {AuthController} from './controller';
import { AuthDatasourceImpl, AuthRepositoryImpl } from "../../infrastructure";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class AuthRoutes {
    constructor() { }

    static get routes(): Router {
        const router = Router();
        const datasource = new AuthDatasourceImpl();
        const authRepository = new AuthRepositoryImpl(datasource);
        const controller = new AuthController(authRepository);
        // Definir todos mis rutas principales
        router.post('/login', controller.loginUser);
        router.post('/register', controller.registerUser);

        router.get('/', [AuthMiddleware.validateJWT]  ,controller.getUsers);
        return router;
    }
}