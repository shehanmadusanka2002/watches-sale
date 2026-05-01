import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<Pick<import("./entities/user.entity").User, "email" | "id" | "username" | "role">[]>;
    deleteCustomer(id: string): Promise<{
        message: string;
    }>;
}
