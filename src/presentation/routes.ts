import { Router } from "express";
import { AuthRoutes } from "./auth/routes";

export class AppRoutes {
    constructor() { }

    static get routes(): Router {
        const router = Router();
        // Definir todos mis rutas principales
        router.use('/api/auth', AuthRoutes.routes);

        return router;
    }
}