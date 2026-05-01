import { BadRequestException, Controller, Delete, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return this.usersService.findAllForAdmin();
  }

  @Delete(':id')
  async deleteCustomer(@Param('id') id: string) {
    const parsedId = Number(id);
    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      throw new BadRequestException('Invalid user id');
    }

    await this.usersService.deleteCustomerById(parsedId);
    return { message: 'Customer deleted successfully' };
  }
}
