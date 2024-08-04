import { CreateUserDto } from '@Api/dto/request/create-user.dto';
import { CreateUserUseCase } from '@Application/use-cases/user/create-user.use-case';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRoleEnum } from '@Shared/enums/user-role.enum';
import { CreateCustomerUserDto } from '../dto/request/create-customer-user.dto';

@Controller('users')
@ApiTags('User')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post('/customer')
  @ApiOperation({ summary: 'Cadastra um novo usuário cliente' })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 500 })
  async createCustomerUser(
    @Body() createCustomerUserDto: CreateCustomerUserDto,
  ): Promise<void> {
    return this.createUserUseCase.execute({
      user: {
        name: createCustomerUserDto.username,
        email: createCustomerUserDto.email,
        cpf: createCustomerUserDto.cpf,
        role: UserRoleEnum.CUSTOMER,
      },
    });
  }

  // TODO: Auth admin
  @Post('/prep-line')
  @ApiOperation({
    summary: 'Cadastra um novo usuário para a linha de produção',
  })
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400 })
  @ApiResponse({ status: 500 })
  async createPreplineUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<void> {
    return this.createUserUseCase.execute({
      user: {
        name: createUserDto.username,
        email: createUserDto.email,
        password: createUserDto.password,
        role: UserRoleEnum.PREP_LINE,
      },
    });
  }
}
