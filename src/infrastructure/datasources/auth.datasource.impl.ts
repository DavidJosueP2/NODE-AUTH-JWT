import { BcryptAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";
import { AuthDatasource, CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";
import { UserMapper } from "../mappers/user.mapper";

type HashFunction = (password: string) => string;
type compareFunction = (password: string, hash: string) => Promise<boolean>;

export class AuthDatasourceImpl implements AuthDatasource {

    constructor(
        private readonly hashPassword: HashFunction = BcryptAdapter.hash,
        private readonly comparePassword: compareFunction = BcryptAdapter.compare,
    ) { }

    async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const { email, password } = loginUserDto;

        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw CustomError.badRequest('User does not exist - email');
            }
            const isMatching = await this.comparePassword(password, user.password);
            if (!isMatching) {
                throw CustomError.badRequest('Invalid password');
            }

            return UserMapper.userEntityFromObject(user);


        } catch (error) {
            console.log('LOGIN ERROR:', error);
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer();
        }
    }



    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        const { name, email, password } = registerUserDto;
        try {
            //1. Verificar si el correo existe
            const exists = await UserModel.findOne({ email });
            if (exists) throw CustomError.badRequest('User already exists');


            //2. Hash de constraseña
            const user = await UserModel.create({
                name: name,
                email: email,
                password: this.hashPassword(password)
            });

            await user.save();

            //3. Mapear la respuessta a UserEntity
            return UserMapper.userEntityFromObject(user);

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer();
        }
    }
}