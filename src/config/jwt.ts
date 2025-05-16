import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {
    static async generateToken(
        payload: object,
        duration: string | number = '2h'
    ): Promise<string | null> {

        const secret: Secret = JWT_SEED;

        return new Promise((resolve) => {
            const options: SignOptions = {
                expiresIn: duration as any,
            };

            jwt.sign(payload, secret, options, (err, token) => {
                if (err) return resolve(null);
                resolve(token!);
            });
        });
    }

    static validateToken<T>(token: string): Promise<T | null>{
        return new Promise((resolve) =>{
            jwt.verify(token, JWT_SEED, (err, decoded) =>{
                if(err) return resolve(null);
                resolve(decoded as T);
            })
        });
    }
}
