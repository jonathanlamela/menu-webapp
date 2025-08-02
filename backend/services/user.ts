import { User } from "shared/types";
import { CreateUserRequest, CreateUserResponse } from "shared/dtos/user";
import { getDb } from "utils/db";
const bcrypt = require('bcrypt');
const saltRounds = 10;

export default class UserService {

    async create(data: CreateUserRequest): Promise<CreateUserResponse> {
        const db = await getDb();
        var passwordHash = await bcrypt.hash(data.password, saltRounds);
        const documentCreated = await db.collection<User>("users").insertOne({
            email: data.email,
            passwordHash: passwordHash,
            firstName: data.firstName,
            lastName: data.lastName,
            role: "user"
        });
        if (documentCreated.acknowledged) {
            const _id = documentCreated.insertedId;
            return { id: _id } as CreateUserResponse;
        } else {
            throw Error('unable to create user');
        }
    }

}
