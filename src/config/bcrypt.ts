import { compare, hashSync } from 'bcryptjs';

export class BcryptAdapter {

    static hash(password: string): string {
        return hashSync(password);
    }

    static async compare(password: string, hashed: string): Promise<boolean> {
        return await compare(password, hashed);
    }
}
