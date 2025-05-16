import { Request, Response } from "express";
import { AuthRepository, CustomError, LoginUser, LoginUserDto, RegisterUser, RegisterUserDto } from "../../domain";
import { UserModel } from "../../data/mongodb";

export class AuthController {
    constructor(
        private readonly authRepository: AuthRepository,
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }

    registerUser = async (req: Request, res: Response): Promise<void> => {
        const [error, registerUserDto] = RegisterUserDto.create(req.body);

        if (error) {
            res.status(400).json({ error });
            return;
        }

        new RegisterUser(this.authRepository)
            .execute(registerUserDto!)
             .then(user => res.json(user))
            .catch(error => this.handleError(error, res));
    }


    loginUser = async (req: Request, res: Response): Promise<void> => {
         const [error, loginUserDto] = LoginUserDto.create(req.body);

        if (error) {
            res.status(400).json({ error });
            return;
        }

        new LoginUser(this.authRepository)
            .execute(loginUserDto!)
             .then(user => res.json(user))
            .catch(error => this.handleError(error, res));
    }

    getUsers = async (req: Request, res: Response): Promise<void> => {
        UserModel.find()
            .then(users =>
                res.json({
                    //users,
                    user: (req as any).user

                }))
            .catch(() => res.status(500).json({ error: 'Internal Server Error' }))
    }



}
