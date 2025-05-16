import { Request, Response, NextFunction, RequestHandler } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";

export class AuthMiddleware {
    static validateJWT: RequestHandler = async (req, res, next) => {
        const authorization = req.header('Authorization');

        if (!authorization) {
            res.status(401).json({ error: 'No token provided.' });
            return;
        }

        if (!authorization.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Invalid Bearer token.' });
            return;
        }

        const token = authorization.split(' ')[1];

        try {
            const payload = await JwtAdapter.validateToken<{id: string}>(token); 

            if (!payload) {
                res.status(401).json({ error: 'Invalid token' });
                return;
            }

            const user = await UserModel.findById(payload.id);
            if (!user) {
                res.status(401).json({error: 'Invalid token - user not found'})
                return;
            }

            (req as any).user = user;
            
            next();
        } catch (error) {
            console.log(error);
            res.status(401).json({ error: 'Invalid or expired token.' });
        }
    };
}
