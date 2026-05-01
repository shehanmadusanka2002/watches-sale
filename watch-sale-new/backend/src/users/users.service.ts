import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    if (!user.role) {
      user.role = Role.CUSTOMER;
    }
    if (!user.id) {
      // Some legacy DB schemas don't define AUTO_INCREMENT on users.id.
      // Assign the next integer id in application code for compatibility.
      const raw = await this.usersRepository
        .createQueryBuilder('user')
        .select('COALESCE(MAX(user.id), 0) + 1', 'nextId')
        .getRawOne<{ nextId: string | number }>();

      user.id = Number(raw?.nextId ?? 1);
    }
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findAllForAdmin(): Promise<Array<Pick<User, 'id' | 'username' | 'email' | 'role'>>> {
    return this.usersRepository.find({
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
      },
      order: {
        id: 'DESC',
      },
    });
  }

  async deleteCustomerById(id: number): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role !== Role.CUSTOMER) {
      throw new ForbiddenException('Only customer accounts can be deleted');
    }

    try {
      await this.usersRepository.remove(user);
    } catch {
      throw new BadRequestException('Unable to delete customer account');
    }
  }
}
